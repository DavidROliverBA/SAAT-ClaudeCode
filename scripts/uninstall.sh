#!/usr/bin/env bash

# SAAT Claude Code Sub-Agents Global Uninstallation Script
# Removes SAAT agents from ~/.claude/agents/

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Main uninstallation
main() {
    print_header "SAAT Claude Code Sub-Agents - Global Uninstallation"

    GLOBAL_AGENTS_DIR="$HOME/.claude/agents"

    # Check if global agents directory exists
    if [ ! -d "$GLOBAL_AGENTS_DIR" ]; then
        print_warning "Global agents directory not found: ${GLOBAL_AGENTS_DIR}"
        print_info "No SAAT agents to uninstall"
        exit 0
    fi

    # Count existing SAAT agents
    AGENT_COUNT=$(find "$GLOBAL_AGENTS_DIR" -name "saat-*.md" -type f 2>/dev/null | wc -l)

    if [ "$AGENT_COUNT" -eq 0 ]; then
        print_info "No SAAT agents found in ${GLOBAL_AGENTS_DIR}"
        exit 0
    fi

    print_warning "Found ${AGENT_COUNT} SAAT agents in ${GLOBAL_AGENTS_DIR}"
    echo ""

    # List agents to be removed
    print_info "The following agents will be removed:"
    echo ""
    find "$GLOBAL_AGENTS_DIR" -name "saat-*.md" -type f | while read -r agent; do
        echo "  - $(basename "$agent")"
    done
    echo ""

    # Confirm uninstallation
    read -p "Are you sure you want to uninstall all SAAT agents? (y/N): " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Uninstallation cancelled"
        exit 0
    fi
    echo ""

    # Remove agents
    print_header "Uninstalling SAAT Agents"

    REMOVED=0
    FAILED=0

    find "$GLOBAL_AGENTS_DIR" -name "saat-*.md" -type f | while read -r agent_file; do
        agent_name=$(basename "$agent_file")

        if rm "$agent_file"; then
            print_success "Removed: ${agent_name}"
            ((REMOVED++))
        else
            print_error "Failed to remove: ${agent_name}"
            ((FAILED++))
        fi
    done

    echo ""
    print_header "Uninstallation Summary"

    if [ $FAILED -eq 0 ]; then
        print_success "All SAAT agents removed successfully!"
    else
        print_warning "${REMOVED} agents removed, ${FAILED} failed"
    fi

    echo ""
    print_info "SAAT agents have been uninstalled from: ${GLOBAL_AGENTS_DIR}"
    echo ""
    print_info "To reinstall, run: ./scripts/install.sh"
    echo ""
}

# Run main function
main "$@"
