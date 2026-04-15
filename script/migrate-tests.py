#!/usr/bin/env python3
"""
Migrate all test/*.js files from gun.js → zen.js.

Transformations applied to each file:
  1. `import X from 'PATH/gun.js'`
     → `import X from 'PATH/zen.js'` (rename only, wrapper is added later)
     BUT the variable is renamed to __ZEN and a compat wrapper is inserted.
  2. `import SEA from 'PATH/sea.js'` – kept as-is (sea tests still need it)
  3. `describe('Gun'`  → `describe('ZEN'`
  4. `'/gun.js': PATH`  → `'/zen.js': PATH`   (panic HTTP servers)
  5. `gun.js` in HTML strings (panic tests using script tags) → `zen.js`
  6. `// Gun` / `Gun ` in leading comments → `// ZEN` / `ZEN `
"""

import re
import sys
import os
from pathlib import Path

ROOT = Path(__file__).parent.parent
TEST_DIR = ROOT / 'test'

# ── Helpers ──────────────────────────────────────────────────────────────────

def compat_wrapper(zen_import_name: str) -> str:
    """Return JS lines that create a ZEN wrapper for test use.

    ZEN must be imported BEFORE lib/store.js and lib/rfs.js so that
    globalThis.Gun is set to ZEN's internal GUN when lib adapters register.
    """
    return (
        f"var __gun = (function(){{\n"
        f"  var W = function(o){{return new {zen_import_name}(o)}};\n"
        f"  Object.setPrototypeOf(W, {zen_import_name});\n"
        f"  W.prototype = {zen_import_name}.prototype;\n"
        f"  return W;\n"
        f"}}());"
    )


def find_existing_zen_import(lines: list[str]) -> str | None:
    """Return the import binding name if zen.js is already imported."""
    zen_re = re.compile(r"""^import\s+([\w]+)\s+from\s+['"][^'"]*zen\.js['"]\s*;""")
    for line in lines:
        m = zen_re.match(line.rstrip('\n\r'))
        if m:
            return m.group(1)
    return None


def find_zen_import_line_index(lines: list[str]) -> int:
    """Return index of existing zen.js import line, or -1."""
    zen_re = re.compile(r"""^import\s+[\w]+\s+from\s+['"][^'"]*zen\.js['"]\s*;""")
    for i, line in enumerate(lines):
        if zen_re.match(line.rstrip('\n\r')):
            return i
    return -1


def migrate_content(src: str, filepath: Path) -> str:
    lines = src.splitlines(keepends=True)

    # ── Pre-scan ────────────────────────────────────────────────────────────
    existing_zen_var = find_existing_zen_import(lines)
    zen_line_idx     = find_zen_import_line_index(lines)

    # Find gun.js import (to derive zen.js path + binding name)
    import_gun_re = re.compile(
        r"""^import\s+([\w]+)\s+from\s+(['"])((?:[./]+)*(gun\.js))\2\s*;?\s*$"""
    )
    gun_binding = None   # e.g. '__gun'
    gun_quote   = None   # e.g. '"' or "'"
    zen_path    = None   # derived zen.js relative path
    for line in lines:
        m = import_gun_re.match(line.rstrip('\n\r'))
        if m:
            gun_binding = m.group(1)
            gun_quote   = m.group(2)
            gun_rel     = m.group(3)   # e.g. '../../gun.js'
            zen_path    = gun_rel.replace('gun.js', 'zen.js')
            break

    if gun_binding is None and not existing_zen_var:
        # Only string replacements needed (no gun.js import found)
        return _string_subs(src)

    # Derive quote/path from existing zen import line if gun not found
    if gun_binding is None and zen_line_idx >= 0:
        zen_line = lines[zen_line_idx].rstrip('\n\r')
        m = re.match(r"""^import\s+[\w]+\s+from\s+(['"])([^'"]+)\1""", zen_line)
        if m:
            gun_quote = m.group(1)
            zen_path  = m.group(2)   # already zen.js path

    zen_var = existing_zen_var or '__ZEN'

    # Does the file have lib/store.js or lib/rfs.js imports?
    lib_import_re = re.compile(r"""^import\s+['"'][^'"]*lib/(store|rfs)\.js""")
    first_lib_idx = next(
        (i for i, l in enumerate(lines) if lib_import_re.match(l.rstrip('\n\r'))),
        -1
    )
    has_lib_imports = first_lib_idx >= 0

    # If zen.js already exists but comes AFTER lib imports, remove it so we
    # can re-inject it before the lib imports.
    lines_to_process = lines
    zen_needs_move = (
        has_lib_imports
        and zen_line_idx >= 0
        and zen_line_idx > first_lib_idx
    )
    if zen_needs_move:
        lines_to_process = [l for i, l in enumerate(lines) if i != zen_line_idx]

    # ── Second pass: emit transformed file ─────────────────────────────────
    out = []
    zen_injected = (existing_zen_var is not None and not zen_needs_move)
    gun_wrapper_emitted = False

    for line in lines_to_process:
        stripped = line.rstrip('\n\r')

        # —— Inject zen import BEFORE the first lib/store or lib/rfs line ——
        if has_lib_imports and not zen_injected and lib_import_re.match(stripped):
            out.append(f"import {zen_var} from {gun_quote}{zen_path}{gun_quote};\n")
            zen_injected = True

        # —— Replace gun.js import line with wrapper ——————————————————————
        m = import_gun_re.match(stripped)
        if m:
            orig_name = m.group(1)
            # If zen not injected yet (no lib imports), inject now
            if not zen_injected:
                out.append(f"import {zen_var} from {gun_quote}{zen_path}{gun_quote};\n")
                zen_injected = True
            if not gun_wrapper_emitted:
                out.append(compat_wrapper(zen_var) + "\n")
                gun_wrapper_emitted = True
            # Alias original binding → __gun if they differ
            if orig_name != '__gun':
                out.append(f"var {orig_name} = __gun;\n")
            continue  # consume the gun.js import line

        # —— String substitutions ———————————————————————————————————————
        line = re.sub(r"describe\('Gun'", "describe('ZEN'", line)
        line = re.sub(r"'/gun\.js'(\s*:)", r"'/zen.js'\1", line)
        line = re.sub(r'src="/gun\.js"', 'src="/zen.js"', line)
        line = re.sub(r"src='/gun\.js'", "src='/zen.js'", line)
        line = re.sub(r"load\('gun\.js'", "load('zen.js'", line)
        out.append(line)

    return ''.join(out)


def _string_subs(src: str) -> str:
    """Apply only string substitutions (no import changes)."""
    src = re.sub(r"describe\('Gun'", "describe('ZEN'", src)
    src = re.sub(r"'/gun\.js'(\s*:)", r"'/zen.js'\1", src)
    src = re.sub(r'src="/gun\.js"', 'src="/zen.js"', src)
    src = re.sub(r"src='/gun\.js'", "src='/zen.js'", src)
    src = re.sub(r"load\('gun\.js'", "load('zen.js'", src)
    return src


def migrate_file(path: Path) -> bool:
    """Returns True if the file was modified."""
    src = path.read_text(encoding='utf-8')
    if 'gun.js' not in src:
        return False
    new_src = migrate_content(src, path)
    if new_src == src:
        return False
    path.write_text(new_src, encoding='utf-8')
    return True


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    changed = []
    skipped = []

    for js in sorted(TEST_DIR.rglob('*.js')):
        # Skip already-zen test files
        rel = js.relative_to(ROOT)
        if 'zen/' in str(rel):
            continue
        try:
            if migrate_file(js):
                changed.append(str(rel))
            else:
                skipped.append(str(rel))
        except Exception as e:
            print(f"  ERROR {rel}: {e}", file=sys.stderr)

    print(f"\n{'='*60}")
    print(f"Modified {len(changed)} files:")
    for f in changed:
        print(f"  + {f}")
    print(f"\nUnchanged: {len(skipped)} files")


if __name__ == '__main__':
    main()
