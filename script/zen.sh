#!/bin/bash
# zen - ZEN Entropy Network CLI
# POSIX / XDG Base Directory Specification compliant
# https://specifications.freedesktop.org/basedir-spec/latest/

set -euo pipefail

# ── XDG Base Directory defaults ──────────────────────────────────────────────
XDG_CONFIG_HOME="${XDG_CONFIG_HOME:-$HOME/.config}"
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.local/share}"
XDG_STATE_HOME="${XDG_STATE_HOME:-$HOME/.local/state}"

ZEN_CONFIG_DIR="$XDG_CONFIG_HOME/zen"
ZEN_DATA_DIR="$XDG_DATA_HOME/zen"
ZEN_STATE_DIR="$XDG_STATE_HOME/zen"

# ── Terminal colours ──────────────────────────────────────────────────────────
if [[ -t 1 ]]; then
    RED='\033[0;31m' GREEN='\033[0;32m' YELLOW='\033[1;33m'
    CYAN='\033[0;36m' BOLD='\033[1m' NC='\033[0m'
else
    RED='' GREEN='' YELLOW='' CYAN='' BOLD='' NC=''
fi

err()  { echo -e "${RED}[error]${NC} $*" >&2; }
info() { echo -e "${GREEN}[info]${NC} $*"; }

# ── Locate install directory ──────────────────────────────────────────────────
find_install_dir() {
    local f="$ZEN_CONFIG_DIR/install_dir"
    if [[ -f "$f" ]]; then
        local d
        d="$(cat "$f")"
        [[ -d "$d/script" ]] && echo "$d" && return
    fi
    # Fallback: common locations
    for d in "$HOME/zen" "/opt/zen"; do
        [[ -d "$d/script" ]] && echo "$d" && return
    done
}

# ── zen status ────────────────────────────────────────────────────────────────
cmd_status() {
    local install_dir service_name node_ver

    install_dir="$(find_install_dir || true)"
    service_name=""
    [[ -f "$ZEN_CONFIG_DIR/service_name" ]] && service_name="$(cat "$ZEN_CONFIG_DIR/service_name")"
    [[ -z "$service_name" ]] && service_name="relay"

    local sep="────────────────────────────────"

    echo -e "${BOLD}ZEN${NC}"
    echo "$sep"
    if [[ -n "$install_dir" ]] && [[ -f "$install_dir/package.json" ]]; then
        local ver
        ver="$(node -e "process.stdout.write(require('$install_dir/package.json').version)" 2>/dev/null || echo "unknown")"
        echo -e "  version    ${CYAN}$ver${NC}"
        echo    "  install    $install_dir"
    else
        echo -e "  ${YELLOW}ZEN not found — run: curl -fsSL https://raw.githubusercontent.com/akaoio/zen/main/script/install.sh | bash${NC}"
    fi
    node_ver="$(node --version 2>/dev/null || echo "not installed")"
    echo    "  node.js    $node_ver"

    echo ""
    echo -e "${BOLD}Service  (${service_name})${NC}"
    echo "$sep"
    if command -v systemctl &>/dev/null && systemctl list-units --full --all 2>/dev/null | grep -q "^${service_name}.service"; then
        local active
        active="$(systemctl is-active "$service_name" 2>/dev/null || echo "unknown")"
        local col="${GREEN}"
        [[ "$active" != "active" ]] && col="${RED}"
        echo -e "  status     ${col}${active}${NC}"

        local elapsed
        elapsed="$(systemctl show "$service_name" --property=ActiveEnterTimestamp 2>/dev/null \
            | sed 's/ActiveEnterTimestamp=//' | grep -v '^$' || true)"
        [[ -n "$elapsed" ]] && echo "  since      $elapsed"

        local port
        port="$(systemctl show "$service_name" --property=Environment 2>/dev/null \
            | grep -oP 'PORT=\K[0-9]+' || true)"
        [[ -n "$port" ]] && echo "  port       $port"
    else
        echo -e "  ${YELLOW}service not found${NC}  (not a systemd host, or service not installed)"
    fi

    echo ""
    echo -e "${BOLD}Paths  (XDG)${NC}"
    echo "$sep"
    echo "  config     $ZEN_CONFIG_DIR"
    echo "  data       $ZEN_DATA_DIR"
    echo "  state      $ZEN_STATE_DIR"

    local cert="$ZEN_CONFIG_DIR/cert.pem"
    if [[ -f "$cert" ]]; then
        echo ""
        echo -e "${BOLD}SSL${NC}"
        echo "$sep"
        echo "  cert       $cert"
        local expiry
        expiry="$(openssl x509 -enddate -noout -in "$cert" 2>/dev/null \
            | sed 's/notAfter=//' || echo "unknown")"
        echo "  expires    $expiry"
    fi
}

# ── zen update ────────────────────────────────────────────────────────────────
cmd_update() {
    local install_dir
    install_dir="$(find_install_dir || true)"
    if [[ -z "$install_dir" ]]; then
        err "ZEN install directory not found."
        err "Re-run: curl -fsSL https://raw.githubusercontent.com/akaoio/zen/main/script/install.sh | bash"
        exit 1
    fi
    exec "$install_dir/script/update.sh" "$@"
}

# ── zen uninstall ─────────────────────────────────────────────────────────────
cmd_uninstall() {
    local install_dir
    install_dir="$(find_install_dir || true)"
    if [[ -z "$install_dir" ]]; then
        err "ZEN install directory not found."
        exit 1
    fi
    exec "$install_dir/script/uninstall.sh" "$@"
}

# ── help ──────────────────────────────────────────────────────────────────────
show_help() {
    cat << EOF
${BOLD}zen${NC} — ZEN Entropy Network CLI

${BOLD}USAGE${NC}
    zen <command> [options]

${BOLD}COMMANDS${NC}
    status      Show relay status, service state, and XDG paths
    update      Pull latest code and restart service
    uninstall   Remove ZEN from this system
    help        Show this message

${BOLD}XDG PATHS${NC}
    Config   \$XDG_CONFIG_HOME/zen   (default: ~/.config/zen)
    Data     \$XDG_DATA_HOME/zen     (default: ~/.local/share/zen)
    State    \$XDG_STATE_HOME/zen    (default: ~/.local/state/zen)

${BOLD}INSTALL / REINSTALL${NC}
    curl -fsSL https://raw.githubusercontent.com/akaoio/zen/main/script/install.sh | bash
EOF
}

# ── dispatch ──────────────────────────────────────────────────────────────────
cmd="${1:-help}"
shift || true
case "$cmd" in
    status)              cmd_status "$@" ;;
    update)              cmd_update "$@" ;;
    uninstall)           cmd_uninstall "$@" ;;
    help|-h|--help)      show_help ;;
    *) err "Unknown command: $cmd"; show_help; exit 1 ;;
esac
