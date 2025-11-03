#!/usr/bin/env bash

# SAAT Claude Code Sub-Agents Global Installation Script
# Installs SAAT agents globally to ~/.claude/agents/

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
    print_header "SAAT Claude Code Sub-Agents - Global Installation"

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

    # Create global agents directory if it doesn't exist
    GLOBAL_AGENTS_DIR="$HOME/.claude/agents"

    if [ ! -d "$GLOBAL_AGENTS_DIR" ]; then
        print_info "Creating global agents directory: ${GLOBAL_AGENTS_DIR}"
        mkdir -p "$GLOBAL_AGENTS_DIR"
        print_success "Directory created"
    else
        print_info "Global agents directory exists: ${GLOBAL_AGENTS_DIR}"
    fi
    echo ""

    # Check for existing SAAT agents and prompt for overwrite
    EXISTING_AGENTS=$(find "$GLOBAL_AGENTS_DIR" -name "saat-*.md" -type f 2>/dev/null | wc -l)

    if [ "$EXISTING_AGENTS" -gt 0 ]; then
        print_warning "Found ${EXISTING_AGENTS} existing SAAT agents in ${GLOBAL_AGENTS_DIR}"
        echo ""
        read -p "Do you want to overwrite existing agents? (y/N): " -n 1 -r
        echo ""

        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Installation cancelled"
            exit 0
        fi
        echo ""
    fi

    # Install agents
    print_header "Installing SAAT Agents"

    INSTALLED=0
    FAILED=0

    for agent_file in agents/*.md; do
        agent_name=$(basename "$agent_file")

        # Copy agent to global directory
        if cp "$agent_file" "$GLOBAL_AGENTS_DIR/$agent_name"; then
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
        print_success "All ${INSTALLED} agents installed successfully!"
    else
        print_warning "${INSTALLED} agents installed, ${FAILED} failed"
    fi

    echo ""
    print_info "Agents installed to: ${GLOBAL_AGENTS_DIR}"
    echo ""

    # List installed agents
    print_header "Installed SAAT Agents"
    echo ""

    echo "  1. saat-orchestrate.md         - AI architecture consultant (START HERE)"
    echo "  2. saat-discover.md            - Analyze existing codebases"
    echo "  3. saat-requirements.md        - Extract requirements from documents"
    echo "  4. saat-generate.md            - Create C4 architecture models"
    echo "  5. saat-analyze-characteristics.md - Evaluate architecture quality"
    echo "  6. saat-validate.md            - Validate model correctness"
    echo "  7. saat-security.md            - Security analysis"
    echo "  8. saat-document.md            - Generate documentation"
    echo "  9. saat-terraform.md           - Generate Terraform IaC"
    echo " 10. saat-full-pipeline.md       - Complete analysis workflow"
    echo " 11. saat-help.md                - Help and guidance"

    echo ""
    print_header "Next Steps"
    echo ""
    print_info "Open Claude Code and use the Task tool to invoke agents:"
    echo ""
    echo "  Example 1 - Guided experience:"
    echo "    Task(subagent_type=\"saat-orchestrate\", prompt=\"I want to analyze my e-commerce platform\")"
    echo ""
    echo "  Example 2 - Full pipeline:"
    echo "    Task(subagent_type=\"saat-full-pipeline\", prompt=\"Analyze /path/to/repo\")"
    echo ""
    echo "  Example 3 - Discover codebase:"
    echo "    Task(subagent_type=\"saat-discover\", prompt=\"Analyze repository at /path/to/repo\")"
    echo ""
    print_info "For help, invoke the saat-help agent"
    echo ""
    print_success "Installation complete! Happy architecting! 🎉"
    echo ""
}

# Run main function
main "$@"
