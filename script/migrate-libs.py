#!/usr/bin/env python3
"""
Migrate all lib/*.js (and src/pen.js) from GUN to ZEN:
  1. Replace 'import ... from ../gun.js' with '../zen.js'
  2. Remove all globalThis.GUN / globalThis.Gun exposure
  3. Remove globalThis exposure of Radisk, Storage engines, pen
  4. Rename constructor variable references: Gun -> Zen, GUN -> Zen
  5. Patch zen.js / gun.js to remove globalThis setter lines
"""

import re
import os

ZEN_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB_DIR  = os.path.join(ZEN_ROOT, 'lib')

def word_replace(src, old, new):
    return re.sub(r'\b' + re.escape(old) + r'\b', new, src)

def replace_not_block(src):
    """lib/not.js: if/else block using globalThis.Gun with __zen in else."""
    pat = re.compile(
        r'if\s*\(\s*typeof\s+globalThis\s*!==\s*["\']undefined["\']\s*\)\s*\{[^\n]*\n'
        r'[^\n]*var\s+(?:Gun|GUN)\s*=\s*globalThis\.(?:Gun|GUN);?\s*\n'
        r'\s*\}\s*else\s*\{[^\n]*\n'
        r'[^\n]*var\s+(?:Gun|GUN)\s*=\s*__zen;?\s*\n'
        r'\s*\}',
        re.MULTILINE,
    )
    return pat.sub('var Zen = __zen;', src)

def replace_radisk2_block(src):
    """lib/radisk2.js: if/else block that also exposes globalThis.Radisk."""
    pat = re.compile(
        r'if\s*\(\s*typeof\s+globalThis\s*!==\s*["\']undefined["\']\s*\)\s*\{[^\n]*\n'
        r'[^\n]*var\s+(?:Gun|GUN)\s*=\s*globalThis\.(?:Gun|GUN);\s*\n'
        r'[^\n]*var\s+Radix\s*=\s*globalThis\.Radix;\s*\n'
        r'[^\n]*globalThis\.\w+\s*=\s*\w+;\s*\n'
        r'\s*\}\s*else\s*\{[^\n]*\n'
        r'[^\n]*var\s+(?:Gun|GUN)\s*=\s*__zen;\s*\n'
        r'(?P<radix_line>[^\n]*var\s+Radix\s*=\s*(?P<radix_import>\w+);\s*\n)'
        r'(?P<default_line>[^\n]*try\{[^}]+\}catch\(e\)\{\}\s*\n)'
        r'\s*\}',
        re.MULTILINE,
    )
    def _rep(m):
        ri = m.group('radix_import')
        return (
            '\t\tvar Zen = __zen;\n'
            '\t\tvar Radix = ' + ri + ';\n'
            '\t\ttry{ __defaultExport = Radisk }catch(e){}'
        )
    return pat.sub(_rep, src)

def remove_store_globthis_block(src):
    """Remove Store.globalThis exposure lines."""
    src = re.sub(
        r'[^\n]*\(Store\.globalThis\s*=\s*globalThis\)\.[^\n]+\n',
        '',
        src,
        flags=re.MULTILINE,
    )
    src = re.sub(
        r'[^\n]*Store\.indexedDB\s*=\s*globalThis\.indexedDB\s*;[^\n]*\n',
        '',
        src,
        flags=re.MULTILINE,
    )
    # Clean up if(globalThis) {} else { content } → content
    # Use line-based matching to handle nested braces in try-catch content
    src = re.sub(
        r'if\s*\(\s*typeof\s+globalThis\s*!==\s*["\']undefined["\']\s*\)\s*\{\s*\n'
        r'\s*\}\s*else\s*\{\s*\n'
        r'((?:\s*[^\n]+\n)*?)'  # zero or more content lines (non-greedy)
        r'\s*\}',
        lambda m: m.group(1),
        src,
        flags=re.MULTILINE,
    )
    # Also remove fully-empty if(globalThis) {} blocks (no else)
    src = re.sub(
        r'if\s*\(\s*typeof\s+globalThis\s*!==\s*["\']undefined["\']\s*\)\s*\{\s*\n\s*\}\s*\n',
        '',
        src,
        flags=re.MULTILINE,
    )
    return src

_TRAIL = r'(?P<trail>\s*,\s*\w+)?'

GLOBTHIS_VAR_PATTERNS = [
    # var Gun = (typeof globalThis ...)? __zen : <anything>  -- globalThis already replaced
    re.compile(
        r'var\s+(?:Gun|GUN)\s*=\s*\([^)]*typeof\s+globalThis[^)]*\)\s*\?\s*__zen\s*:[^\n;]+' + _TRAIL + r'\s*;',
        re.MULTILINE,
    ),
    # var Gun = globalThis.Gun  (any remaining)
    re.compile(r'var\s+(?:Gun|GUN)\s*=\s*globalThis\.(?:Gun|GUN)' + _TRAIL + r'\s*;', re.MULTILINE),
    # var Gun = __zen[, u];
    re.compile(r'var\s+(?:Gun|GUN)\s*=\s*__zen' + _TRAIL + r'\s*;', re.MULTILINE),
    # var Gun = ZenMod[, u];
    re.compile(r'var\s+(?:Gun|GUN)\s*=\s*ZenMod' + _TRAIL + r'\s*;', re.MULTILINE),
]

def replace_var_decl(src):
    def _rep(m):
        raw = m.group(0)
        trail = m.groupdict().get('trail') or ''
        extra = ''
        if trail and trail.strip():
            extra_id = trail.strip().lstrip(',').strip()
            extra = '\nvar ' + extra_id + ';'
        val = 'ZenMod' if 'ZenMod' in raw else '__zen'
        return 'var Zen = ' + val + ';' + extra
    for pat in GLOBTHIS_VAR_PATTERNS:
        src = pat.sub(_rep, src)
    return src

BINDING_RENAME = {
    '__gun': '__zen',
    'Gun':   'Zen',
    'GunMod':'ZenMod',
}

# Order matters for primary_binding selection (first match wins)
BINDING_ORDER = ['__gun', 'GunMod', 'Gun']

def get_primary_binding(gun_bindings):
    """Return the new binding name to use when replacing globalThis.Gun."""
    for old in BINDING_ORDER:
        if old in gun_bindings:
            return BINDING_RENAME[old]
    return '__zen'  # fallback

def migrate_lib_file(filepath):
    with open(filepath, encoding='utf-8') as f:
        src = f.read()

    if "from '../gun.js'" not in src:
        return False, 'no gun.js import'

    original = src

    # 1. Detect binding names
    gun_bindings = set(re.findall(r"import\s+(\w+)\s+from\s+'\.\.\/gun\.js'", src))

    # 2. Fix import source
    src = src.replace("from '../gun.js'", "from '../zen.js'")

    # 3. Rename import binding identifier in import statement
    for old, new in BINDING_RENAME.items():
        if old in gun_bindings:
            src = re.sub(r'\bimport\s+' + re.escape(old) + r'\b', f'import {new}', src)

    # 4. Rename old binding in BODY (must come before globalThis pattern matching)
    for old, new in BINDING_RENAME.items():
        if old in gun_bindings and old != new:
            src = word_replace(src, old, new)

    # 5. Handle special multi-line if/else blocks
    src = replace_not_block(src)
    src = replace_radisk2_block(src)

    # 6. Safety: replace all remaining globalThis.Gun/GUN with the file's primary binding
    #    Handle Store.globalThis.Gun first to avoid partial sub
    pb = get_primary_binding(gun_bindings)
    src = re.sub(r'\bStore\.globalThis\.(?:Gun|GUN)\s*\|\|\s*\w+', pb, src)
    src = re.sub(r'\bglobalThis\.(?:Gun|GUN)\b', pb, src)
    src = re.sub(r'\bwindow\.(?:Gun|GUN)\b', pb, src)

    # 7. Remove Store.globalThis exposure blocks
    src = remove_store_globthis_block(src)

    # 7.5 Handle les.js-style: var Gun = (typeof globalThis...) ? <pb> : (<inner>);
    #     Must run BEFORE generic ternary simplification to avoid mangling inner parens.
    src = re.sub(
        r'var\s+(?:Gun|GUN)\s*=\s*\([^)]*typeof\s+globalThis[^)]*\)\s*\?\s*' + re.escape(pb) + r'\s*:\s*\([^)]*\)' + _TRAIL + r'\s*;',
        lambda m: 'var Zen = ' + ('ZenMod' if 'ZenMod' in m.group(0) else pb) + ';',
        src,
    )

    # 8. Simplify trivial ternary / OR resulting from step 6
    # (typeof globalThis !== "undefined") ? <pb> : anything  → <pb>
    # Use non-greedy + lookahead so we don't consume the closing ) of an IIFE call
    src = re.sub(
        r'\(\s*typeof\s+globalThis\s*!==\s*["\']undefined["\']\s*\)\s*\?\s*' + re.escape(pb) + r'\s*:[^\n;]+?(?=\s*[;)\n])',
        pb, src,
    )
    # (...globalThis...) ? __zen : __zen  → __zen
    src = re.sub(r'\([^)]*globalThis[^)]*\)\s*\?\s*__zen\s*:\s*__zen', '__zen', src)
    # (...globalThis...) || __zen  → __zen
    src = re.sub(r'\([^)]*globalThis[^)]*\)\s*\|\|\s*__zen', '__zen', src)

    # 8b. Simplify: (typeof globalThis ... && pb) || pb → pb  (pen.js && style)
    src = re.sub(
        r'\(\s*typeof\s+globalThis\s*!==\s*["\']undefined["\']\s*&&\s*' + re.escape(pb) + r'\s*\)\s*\|\|\s*' + re.escape(pb),
        pb, src,
    )

    # 9. Replace var Gun = ... declarations
    src = replace_var_decl(src)

    # 10. Simplify IIFE calls: })(pb)
    src = re.sub(r'\}\)\s*\(\s*' + re.escape(pb) + r'\s*\)', '})(' + pb + ')', src, flags=re.MULTILINE)
    # Also handle lingering ternary IIFE args
    src = re.sub(
        r'\}\)\s*\(\s*\([^)]*(?:typeof|globalThis)[^)]*\)\s*\?\s*' + re.escape(pb) + r'\s*:[^\)]+\)',
        '})(' + pb + ')', src,
    )

    # 11. Remove remaining globalThis.Radisk/Radix setters
    src = re.sub(r'\bglobalThis\.(?:Radisk|Radix)\s*=[^\n]+\n', '', src, flags=re.MULTILINE)

    # 11b. Fix Zen.globalThis.Radisk / Zen.globalThis.Radix → direct imports
    src = re.sub(r'\(Zen\.globalThis\s*&&\s*Zen\.globalThis\.Radisk\)\s*\|\|\s*__radisk', '__radisk', src)
    src = re.sub(r'\(Zen\.globalThis\|\|\{\}\)\.Radix\s*\|\|\s*__radix', '__radix', src)

    # 11c. Fix globalThis.Radix / globalThis.Radisk direct accesses (radisk.js)
    src = re.sub(
        r'var\s+Radix\s*=\s*\([^)]*globalThis[^)]*\)\s*\?\s*globalThis\.Radix\s*:\s*(__radix\w*)\s*;',
        lambda m: 'var Radix = ' + m.group(1) + ';',
        src,
    )
    # Remove radisk.js globalThis[name] = exports IIFE
    src = re.sub(
        r'\(\(name,\s*exports\)\s*=>\s*\{[^}]*try[^}]*\}[^}]*if\s*\([^)]*globalThis[^)]*\)\s*\{[^}]*globalThis\[name\][^}]*\}[^}]*\}\)\("Radisk",\s*Radisk\);',
        'try { __defaultExport = Radisk } catch(e) {}',
        src,
    )

    # 11d. Remove globalThis.pen exposure in lib/pen.js
    src = re.sub(
        r'\s*if\s*\(\s*typeof\s+globalThis\s*!==\s*["\']undefined["\']\s*\)\s*\{[^}]*globalThis\.pen[^}]*\}\s*\n?',
        '\n',
        src,
        flags=re.MULTILINE,
    )
    # Remove globalThis.chain / globalThis.resolve / globalThis.soul / globalThis.off (role.js)
    src = re.sub(r'[^\n]*globalThis\.(?:chain|resolve|soul|off)\s*=[^\n]+\n', '', src, flags=re.MULTILINE)
    src = re.sub(r'[^\n]*Role\.globalThis\s*=\s*globalThis[^\n]+\n', '', src, flags=re.MULTILINE)
    src = re.sub(r'\(Role\.globalThis\|\|\{\}\)\.(?:Zen|Gun)\s*\|\|\s*(__\w+)', lambda m: m.group(1), src)

    # 12. Rename Gun→Zen, GUN→Zen throughout
    src = word_replace(src, 'GUN', 'Zen')
    src = word_replace(src, 'Gun', 'Zen')

    if src == original:
        return False, 'unchanged'

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(src)
    return True, 'modified'


def migrate_pen_src(filepath):
    with open(filepath, encoding='utf-8') as f:
        src = f.read()

    if "from '../gun.js'" not in src and 'globalThis.pen' not in src:
        return False, 'nothing to do'

    original = src

    src = src.replace("from '../gun.js'", "from '../zen.js'")
    src = re.sub(r'\bimport\s+GunMod\b', 'import ZenMod', src)
    src = word_replace(src, 'GunMod', 'ZenMod')
    src = re.sub(r'\bglobalThis\.(?:Gun|GUN)\b', 'ZenMod', src)

    # Simplify: var Gun = (...globalThis...) || ZenMod
    src = re.sub(r"var\s+(?:Gun|GUN)\s*=\s*[^;]+\|\|\s*ZenMod\s*;", 'var Zen = ZenMod;', src)
    src = re.sub(r"var\s+(?:Gun|GUN)\s*=\s*ZenMod\s*;", 'var Zen = ZenMod;', src)

    # Remove globalThis.pen exposure
    src = re.sub(
        r'\s*if\s*\(\s*typeof\s+globalThis\s*!==\s*[\'"]undefined[\'"]\s*\)\s*\{[^\}]*globalThis\.pen[^\}]*\}\s*\n?',
        '\n',
        src,
        flags=re.MULTILINE,
    )

    src = word_replace(src, 'Gun', 'Zen')

    if src == original:
        return False, 'unchanged'
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(src)
    return True, 'modified'


def migrate_non_gun_file(filepath):
    """Remove globalThis module exposure from files that don't import gun.js."""
    with open(filepath, encoding='utf-8') as f:
        src = f.read()
    original = src

    # Pattern 1: if(globalThis){ expose } else { try{__defaultExport=X}catch(e){} }
    # → keep just the else-branch content (nomem.js, rmem.js style)
    src = re.sub(
        r'if\s*\(\s*typeof\s+globalThis\s*!==\s*["\']undefined["\']\s*\)\s*\{\s*\n'
        r'\s*globalThis\.\w+\s*=\s*\w+\s*;\s*\n'
        r'\s*\}\s*else\s*\{\s*\n'
        r'(\s*try\{[^}]+\}catch\(e\)\{\})\s*\n'
        r'\s*\}',
        lambda m: m.group(1),
        src,
        flags=re.MULTILINE,
    )

    # Pattern 2: inline if(globalThis !=...){ globalThis.X = x } (yson.js style, no else)
    src = re.sub(
        r"if\s*\(\s*typeof\s+globalThis\s*!=\s*''[^)]*\)\s*\{\s*globalThis\.\w+\s*=\s*\w+\s*\}\n?",
        '',
        src,
        flags=re.MULTILINE,
    )

    if src == original:
        return False, 'unchanged'
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(src)
    return True, 'modified'


def patch_bundle(filepath):
    """Remove globalThis.GUN = globalThis.Gun = Gun from bundle."""
    with open(filepath, encoding='utf-8') as f:
        src = f.read()
    original = src

    # line: ((typeof globalThis && WorkerGlobalScope) ? ((globalThis.GUN=globalThis.Gun=Gun).window=globalThis) : ...window...);
    src = re.sub(
        r'\(\(typeof globalThis !== "undefined" && typeof window === "undefined" && typeof WorkerGlobalScope !== "undefined"\) \? '
        r'\(\(globalThis\.GUN = globalThis\.Gun = Gun\)\.window = globalThis\) : '
        r'\(typeof window !== "undefined" \? '
        r'\(\(window\.GUN = window\.Gun = Gun\)\.window = window\) : undefined\)\);',
        (
            '((typeof globalThis !== "undefined" && typeof window === "undefined" && typeof WorkerGlobalScope !== "undefined") ? '
            '(Gun.window = globalThis) : '
            '(typeof window !== "undefined" ? (Gun.window = window) : undefined));'
        ),
        src,
        flags=re.MULTILINE,
    )

    # ((globalThis.GUN = globalThis.Gun = Gun).globalThis = globalThis);
    src = re.sub(
        r'\(\(globalThis\.GUN = globalThis\.Gun = Gun\)\.globalThis = globalThis\);',
        'Gun.globalThis = globalThis;',
        src,
        flags=re.MULTILINE,
    )

    # var Gun = (typeof globalThis !== 'undefined' && globalThis.Gun) || GUN;
    src = re.sub(
        r"var Gun\s*=\s*\(typeof globalThis !== 'undefined' && globalThis\.Gun\)\s*\|\|\s*GUN\s*;",
        'var Gun = GUN;', src, flags=re.MULTILINE,
    )
    src = re.sub(
        r"var Gun\s*=\s*\(typeof globalThis !== 'undefined' && globalThis\.Gun\)\s*\|\|\s*GunMod\s*;",
        'var Gun = GunMod;', src, flags=re.MULTILINE,
    )
    src = re.sub(
        r"var Gun  = \(typeof globalThis !== 'undefined' && globalThis\.Gun\) \|\| GunMod;",
        'var Gun = GunMod;', src, flags=re.MULTILINE,
    )

    if src == original:
        return False, 'unchanged'
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(src)
    return True, 'modified'


def main():
    results = {}

    lib_files = sorted(
        os.path.join(LIB_DIR, f)
        for f in os.listdir(LIB_DIR)
        if f.endswith('.js')
    )
    for fp in lib_files:
        changed, msg = migrate_lib_file(fp)
        results[os.path.relpath(fp, ZEN_ROOT)] = msg
        if changed:
            print(f'  [OK]  {os.path.relpath(fp, ZEN_ROOT)}')

    # Second pass: remove globalThis module exposures in non-gun-importing files
    for fp in lib_files:
        name = os.path.relpath(fp, ZEN_ROOT)
        if results.get(name) == 'no gun.js import':
            changed, msg = migrate_non_gun_file(fp)
            if changed:
                results[name] = msg
                print(f'  [OK]  {name}  (globalThis cleanup)')

    pen_src = os.path.join(ZEN_ROOT, 'src', 'pen.js')
    if os.path.exists(pen_src):
        changed, msg = migrate_pen_src(pen_src)
        results['src/pen.js'] = msg
        if changed:
            print(f'  [OK]  src/pen.js')

    zen_js = os.path.join(ZEN_ROOT, 'zen.js')
    changed, msg = patch_bundle(zen_js)
    results['zen.js'] = msg
    if changed:
        print(f'  [OK]  zen.js')

    gun_js = os.path.join(ZEN_ROOT, 'gun.js')
    changed, msg = patch_bundle(gun_js)
    results['gun.js'] = msg
    if changed:
        print(f'  [OK]  gun.js')

    modified  = sum(1 for v in results.values() if v == 'modified')
    unchanged = sum(1 for v in results.values() if v == 'unchanged')
    skipped   = sum(1 for v in results.values() if v not in ('modified', 'unchanged'))
    print(f'\nDone: {modified} modified, {unchanged} unchanged, {skipped} skipped.')


if __name__ == '__main__':
    main()
