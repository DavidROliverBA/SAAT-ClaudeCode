#!/usr/bin/env bash
# Bash completion for SAAT (Solution Architects Analysis Toolkit)
#
# Installation:
#   Copy to /etc/bash_completion.d/saat or /usr/share/bash-completion/completions/saat
#   Or source from .bashrc: source /path/to/saat-completion.bash

_saat_completion() {
    local cur prev opts agents_dir

    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"

    # SAAT subcommands
    local subcommands="list install uninstall examples help version verify"

    # SAAT agents
    local agents="orchestrator discover requirements generate validate analyze-characteristics security document terraform full-pipeline help"

    # Agent aliases for convenience
    local agent_aliases="disco req gen val char sec doc tf pipeline"

    # Determine agents directory
    if [ -d "$HOME/.claude/agents" ]; then
        agents_dir="$HOME/.claude/agents"
    elif [ -d ".claude/agents" ]; then
        agents_dir=".claude/agents"
    elif [ -d "/saat/agents" ]; then
        agents_dir="/saat/agents"
    fi

    case "${COMP_CWORD}" in
        1)
            # First argument - complete with subcommands
            COMPREPLY=( $(compgen -W "${subcommands}" -- "${cur}") )
            ;;
        2)
            # Second argument - context-specific completions
            case "${prev}" in
                list)
                    # list [all|installed|available]
                    COMPREPLY=( $(compgen -W "all installed available" -- "${cur}") )
                    ;;
                install)
                    # install [agent-name|all]
                    local available_agents="all ${agents}"
                    COMPREPLY=( $(compgen -W "${available_agents}" -- "${cur}") )
                    ;;
                uninstall)
                    # uninstall [agent-name|all]
                    if [ -d "$agents_dir" ]; then
                        local installed=$(ls "$agents_dir"/saat-*.md 2>/dev/null | xargs -n1 basename | sed 's/^saat-//;s/.md$//')
                        COMPREPLY=( $(compgen -W "all ${installed}" -- "${cur}") )
                    else
                        COMPREPLY=( $(compgen -W "all" -- "${cur}") )
                    fi
                    ;;
                examples)
                    # examples [domain|outputs|all]
                    COMPREPLY=( $(compgen -W "characteristics outputs requirements all" -- "${cur}") )
                    ;;
                verify)
                    # verify [agent-name|all]
                    if [ -d "$agents_dir" ]; then
                        local installed=$(ls "$agents_dir"/saat-*.md 2>/dev/null | xargs -n1 basename | sed 's/^saat-//;s/.md$//')
                        COMPREPLY=( $(compgen -W "all ${installed}" -- "${cur}") )
                    fi
                    ;;
                help)
                    # help [topic]
                    COMPREPLY=( $(compgen -W "agents workflows installation examples docker github-actions" -- "${cur}") )
                    ;;
            esac
            ;;
        3)
            # Third argument - additional context
            case "${COMP_WORDS[1]}" in
                examples)
                    case "${prev}" in
                        characteristics)
                            COMPREPLY=( $(compgen -W "ecommerce healthcare fintech saas microservices" -- "${cur}") )
                            ;;
                        outputs)
                            COMPREPLY=( $(compgen -W "discovery architecture analysis validation security" -- "${cur}") )
                            ;;
                        requirements)
                            COMPREPLY=( $(compgen -W "ecommerce" -- "${cur}") )
                            ;;
                    esac
                    ;;
            esac
            ;;
    esac

    return 0
}

# Register completion
complete -F _saat_completion saat

# Also provide completion for common agent invocations (if using Task tool directly)
_saat_agent_completion() {
    local cur agents
    cur="${COMP_WORDS[COMP_CWORD]}"

    agents="saat-orchestrator saat-discover saat-requirements saat-generate saat-validate saat-analyze-characteristics saat-security saat-document saat-terraform saat-full-pipeline saat-help"

    COMPREPLY=( $(compgen -W "${agents}" -- "${cur}") )
    return 0
}

# Completion for file arguments (architecture.json, characteristics files, etc.)
_saat_file_completion() {
    local cur
    cur="${COMP_WORDS[COMP_CWORD]}"

    # Complete with JSON files in current directory
    COMPREPLY=( $(compgen -f -X '!*.json' -- "${cur}") )
    COMPREPLY+=( $(compgen -f -X '!*.md' -- "${cur}") )

    return 0
}

# Completion helper: show available agents
_saat_list_agents() {
    local agents_dir

    if [ -d "$HOME/.claude/agents" ]; then
        agents_dir="$HOME/.claude/agents"
    elif [ -d ".claude/agents" ]; then
        agents_dir=".claude/agents"
    elif [ -d "/saat/agents" ]; then
        agents_dir="/saat/agents"
    else
        return 1
    fi

    ls "$agents_dir"/saat-*.md 2>/dev/null | xargs -n1 basename | sed 's/^saat-//;s/.md$//'
}

# Advanced completion: dynamic agent help
if [[ -n "${BASH_COMPLETION_VERSINFO}" ]]; then
    # Bash completion 2.x features
    _saat_dynamic_help() {
        local agents_dir="$HOME/.claude/agents"

        if [ -f "$agents_dir/saat-${1}.md" ]; then
            head -n 10 "$agents_dir/saat-${1}.md" | grep -E "^(name|description):" | sed 's/^/  /'
        fi
    }
fi

# Completion debugging (uncomment for troubleshooting)
# export COMP_DEBUG_FILE="$HOME/saat-completion-debug.log"
# _saat_debug() {
#     echo "[$(date)] $*" >> "$COMP_DEBUG_FILE"
# }

# Version info
# SAAT Bash Completion v1.0
# Compatible with Bash 4.0+
