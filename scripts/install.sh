#!/usr/bin/env bash

# SAAT Claude Code Slash Commands Global Installation Script
# Installs SAAT commands globally to ~/.claude/commands/
# Makes all SAAT agents available as slash commands in any Claude Code session

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

# Main installation
main() {
    print_header "SAAT Claude Code Slash Commands - Global Installation"

    # Check if running from correct directory
    if [ ! -d "agents" ]; then
        print_error "agents/ directory not found"
        print_info "Please run this script from the SAAT-ClaudeCode root directory"
        exit 1
    fi

    # Count agents
    AGENT_COUNT=$(find agents -name "*.md" -type f | wc -l)
    print_info "Found ${AGENT_COUNT} SAAT agents to install"
    echo ""

    # Create global commands directory if it doesn't exist
    GLOBAL_COMMANDS_DIR="$HOME/.claude/commands"

    if [ ! -d "$GLOBAL_COMMANDS_DIR" ]; then
        print_info "Creating global commands directory: ${GLOBAL_COMMANDS_DIR}"
        mkdir -p "$GLOBAL_COMMANDS_DIR"
        print_success "Directory created"
    else
        print_info "Global commands directory exists: ${GLOBAL_COMMANDS_DIR}"
    fi
    echo ""

    # Check for existing SAAT commands and prompt for overwrite
    EXISTING_COMMANDS=$(find "$GLOBAL_COMMANDS_DIR" -name "saat-*.md" -type f 2>/dev/null | wc -l)

    if [ "$EXISTING_COMMANDS" -gt 0 ]; then
        print_warning "Found ${EXISTING_COMMANDS} existing SAAT commands in ${GLOBAL_COMMANDS_DIR}"
        echo ""
        read -p "Do you want to overwrite existing commands? (y/N): " -n 1 -r
        echo ""

        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Installation cancelled"
            exit 0
        fi
        echo ""
    fi

    # Install commands
    print_header "Installing SAAT Commands"

    INSTALLED=0
    FAILED=0

    for agent_file in agents/*.md; do
        agent_name=$(basename "$agent_file")

        # Copy agent to global commands directory
        if cp "$agent_file" "$GLOBAL_COMMANDS_DIR/$agent_name"; then
            print_success "Installed: ${agent_name}"
            ((INSTALLED++))
        else
            print_error "Failed: ${agent_name}"
            ((FAILED++))
        fi
    done

    echo ""
    print_header "Installation Summary"

    if [ $FAILED -eq 0 ]; then
        print_success "All ${INSTALLED} commands installed successfully!"
    else
        print_warning "${INSTALLED} commands installed, ${FAILED} failed"
    fi

    echo ""
    print_info "Commands installed to: ${GLOBAL_COMMANDS_DIR}"
    echo ""

    # List installed commands
    print_header "Installed SAAT Commands"
    echo ""

    echo "  1. /saat-orchestrator          - AI architecture consultant (START HERE)"
    echo "  2. /saat-discover              - Analyze existing codebases"
    echo "  3. /saat-requirements          - Extract requirements from documents"
    echo "  4. /saat-generate              - Create C4 architecture models"
    echo "  5. /saat-analyze-characteristics - Evaluate architecture quality"
    echo "  6. /saat-validate              - Validate model correctness"
    echo "  7. /saat-security              - Security analysis"
    echo "  8. /saat-document              - Generate documentation"
    echo "  9. /saat-terraform             - Generate Terraform IaC"
    echo " 10. /saat-full-pipeline         - Complete analysis workflow"
    echo " 11. /saat-help                  - Help and guidance"

    echo ""
    print_header "Next Steps"
    echo ""
    print_info "Open Claude Code and use slash commands directly:"
    echo ""
    echo "  Example 1 - Guided experience:"
    echo "    /saat-orchestrator"
    echo ""
    echo "  Example 2 - Full pipeline:"
    echo "    /saat-full-pipeline"
    echo ""
    echo "  Example 3 - Discover codebase:"
    echo "    /saat-discover"
    echo ""
    print_info "For help, type: /saat-help"
    echo ""
    print_info "Commands are now globally available in all Claude Code sessions!"
    echo ""
    print_success "Installation complete! Happy architecting! 🎉"
    echo ""
}

# Run main function
main "$@"
