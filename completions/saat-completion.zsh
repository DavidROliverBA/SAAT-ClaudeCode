#compdef saat
# Zsh completion for SAAT (Solution Architects Analysis Toolkit)
#
# Installation:
#   1. Copy to a directory in $fpath (e.g., /usr/local/share/zsh/site-functions/_saat)
#   2. Or add to .zshrc: fpath=(~/.zsh/completions $fpath) && autoload -U compinit && compinit
#   3. Rename file to _saat when copying to fpath

_saat() {
    local -a subcommands agents agent_aliases examples_types domains output_types help_topics

    # SAAT subcommands
    subcommands=(
        'list:List available SAAT agents'
        'install:Install SAAT agents to ~/.claude/agents/'
        'uninstall:Remove SAAT agents'
        'examples:Show available examples'
        'help:Show help documentation'
        'version:Show SAAT version'
        'verify:Verify agent installation'
    )

    # SAAT agents
    agents=(
        'orchestrator:AI architecture consultant'
        'discover:Analyze existing codebases'
        'requirements:Extract requirements from documents'
        'generate:Create C4 architecture models'
        'validate:Validate architecture models'
        'analyze-characteristics:Evaluate architecture quality'
        'security:Deep security analysis'
        'document:Generate comprehensive documentation'
        'terraform:Generate infrastructure as code'
        'full-pipeline:Run complete SAAT workflow'
        'help:Interactive help system'
    )

    # Example types
    examples_types=(
        'characteristics:Domain-specific characteristics files'
        'outputs:Sample analysis outputs'
        'requirements:Requirements documents'
        'all:Show all examples'
    )

    # Domain examples
    domains=(
        'ecommerce:E-commerce platform characteristics'
        'healthcare:Healthcare portal characteristics'
        'fintech:Financial platform characteristics'
        'saas:Multi-tenant SaaS characteristics'
        'microservices:Cloud-native microservices characteristics'
    )

    # Output types
    output_types=(
        'discovery:Discovery analysis output'
        'architecture:C4 architecture model'
        'analysis:Characteristics analysis'
        'validation:Validation report'
        'security:Security analysis report'
    )

    # Help topics
    help_topics=(
        'agents:Learn about SAAT agents'
        'workflows:Understand SAAT workflows'
        'installation:Installation instructions'
        'examples:Browse examples'
        'docker:Docker usage'
        'github-actions:CI/CD integration'
    )

    local agents_dir
    if [[ -d "$HOME/.claude/agents" ]]; then
        agents_dir="$HOME/.claude/agents"
    elif [[ -d ".claude/agents" ]]; then
        agents_dir=".claude/agents"
    elif [[ -d "/saat/agents" ]]; then
        agents_dir="/saat/agents"
    fi

    _arguments -C \
        '1: :->command' \
        '2: :->argument' \
        '3: :->subargument' \
        && return 0

    case $state in
        command)
            _describe 'SAAT commands' subcommands
            ;;

        argument)
            case $words[2] in
                list)
                    _values 'list options' \
                        'all[List all agents]' \
                        'installed[List installed agents]' \
                        'available[List available agents]'
                    ;;

                install)
                    local -a available_agents
                    available_agents=('all:Install all agents')
                    for agent in ${agents[@]}; do
                        available_agents+=("${agent%%:*}:${agent#*:}")
                    done
                    _describe 'agents to install' available_agents
                    ;;

                uninstall)
                    if [[ -d "$agents_dir" ]]; then
                        local -a installed_agents
                        installed_agents=('all:Uninstall all agents')
                        for file in "$agents_dir"/saat-*.md(N); do
                            local agent_name="${${file:t}#saat-}"
                            agent_name="${agent_name%.md}"
                            installed_agents+=("${agent_name}:Uninstall ${agent_name}")
                        done
                        _describe 'agents to uninstall' installed_agents
                    else
                        _values 'uninstall options' 'all[Uninstall all]'
                    fi
                    ;;

                examples)
                    _describe 'example types' examples_types
                    ;;

                verify)
                    if [[ -d "$agents_dir" ]]; then
                        local -a verify_agents
                        verify_agents=('all:Verify all agents')
                        for file in "$agents_dir"/saat-*.md(N); do
                            local agent_name="${${file:t}#saat-}"
                            agent_name="${agent_name%.md}"
                            verify_agents+=("${agent_name}:Verify ${agent_name}")
                        done
                        _describe 'agents to verify' verify_agents
                    else
                        _values 'verify options' 'all[Verify all]'
                    fi
                    ;;

                help)
                    _describe 'help topics' help_topics
                    ;;
            esac
            ;;

        subargument)
            case $words[2] in
                examples)
                    case $words[3] in
                        characteristics)
                            _describe 'domain examples' domains
                            ;;
                        outputs)
                            _describe 'output types' output_types
                            ;;
                        requirements)
                            _values 'requirements' 'ecommerce[E-commerce requirements]'
                            ;;
                    esac
                    ;;
            esac
            ;;
    esac
}

# Register completion
_saat "$@"

# Additional completion for files
_saat_files() {
    _files -g "*.json" -g "*.md"
}

# Completion for agent files in agents directory
_saat_agent_files() {
    local agents_dir="$HOME/.claude/agents"

    if [[ -d "$agents_dir" ]]; then
        _files -W "$agents_dir" -g "saat-*.md"
    fi
}

# Helper function: Get agent description
_saat_get_description() {
    local agent="$1"
    local agents_dir="$HOME/.claude/agents"
    local agent_file="$agents_dir/saat-${agent}.md"

    if [[ -f "$agent_file" ]]; then
        grep -m1 "^description:" "$agent_file" | cut -d: -f2- | sed 's/^ *//'
    fi
}

# Dynamic agent listing with descriptions
_saat_installed_agents() {
    local -a installed_agents
    local agents_dir="$HOME/.claude/agents"

    if [[ -d "$agents_dir" ]]; then
        for file in "$agents_dir"/saat-*.md(N); do
            local agent_name="${${file:t}#saat-}"
            agent_name="${agent_name%.md}"
            local description=$(_saat_get_description "$agent_name")
            if [[ -n "$description" ]]; then
                installed_agents+=("${agent_name}:${description}")
            else
                installed_agents+=("${agent_name}:SAAT agent")
            fi
        done
        _describe 'installed agents' installed_agents
    fi
}

# Version info
# SAAT Zsh Completion v1.0
# Compatible with Zsh 5.0+
