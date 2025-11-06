# SAAT Shell Completions

Tab completion for the `saat` command in Bash and Zsh.

## ✨ Features

- Tab completion for all SAAT subcommands
- Context-aware argument suggestions
- Dynamic agent listing based on installation
- File path completion for JSON/Markdown files
- Agent descriptions in completion menu (Zsh)

## 🚀 Installation

### Bash

#### Option 1: System-wide (requires root)

```bash
# Copy to bash completion directory
sudo cp completions/saat-completion.bash /etc/bash_completion.d/saat

# Reload shell
source ~/.bashrc
```

#### Option 2: User-specific

```bash
# Source in .bashrc
echo "source $(pwd)/completions/saat-completion.bash" >> ~/.bashrc

# Reload shell
source ~/.bashrc
```

#### Option 3: Homebrew (macOS)

```bash
# If using Homebrew bash-completion@2
cp completions/saat-completion.bash $(brew --prefix)/etc/bash_completion.d/saat

# Reload shell
source ~/.bash_profile
```

### Zsh

#### Option 1: System-wide (requires root)

```bash
# Copy and rename to _saat
sudo cp completions/saat-completion.zsh /usr/local/share/zsh/site-functions/_saat

# Rebuild completion cache
rm -f ~/.zcompdump
compinit
```

#### Option 2: User-specific

```bash
# Create completions directory
mkdir -p ~/.zsh/completions

# Copy and rename to _saat
cp completions/saat-completion.zsh ~/.zsh/completions/_saat

# Add to .zshrc (before compinit)
echo 'fpath=(~/.zsh/completions $fpath)' >> ~/.zshrc
echo 'autoload -U compinit && compinit' >> ~/.zshrc

# Reload shell
source ~/.zshrc
```

#### Option 3: Oh My Zsh

```bash
# Copy to Oh My Zsh completions
cp completions/saat-completion.zsh ~/.oh-my-zsh/completions/_saat

# Reload shell
source ~/.zshrc
```

## 📝 Usage

### Basic Completion

Type `saat` and press `<Tab>` to see available commands:

```bash
$ saat <Tab>
examples   help       install    list       uninstall  verify     version
```

### Command-Specific Completion

```bash
# List command
$ saat list <Tab>
all  available  installed

# Install command (shows available agents)
$ saat install <Tab>
all                    orchestrator           discover
requirements           generate               validate
analyze-characteristics security              document
terraform              full-pipeline          help

# Examples command
$ saat examples <Tab>
characteristics  outputs  requirements  all
```

### Nested Completion

```bash
# Domain-specific examples
$ saat examples characteristics <Tab>
ecommerce  healthcare  fintech  saas  microservices

# Output types
$ saat examples outputs <Tab>
discovery  architecture  analysis  validation  security
```

### File Completion

Automatically completes JSON and Markdown files:

```bash
$ saat generate <Tab>
architecture.json  discovery.json  requirements.json  README.md
```

## 🎯 Completion Examples

### Bash

```bash
# Show all commands
$ saat <Tab><Tab>
examples   help       install    list       uninstall  verify     version

# Install specific agent
$ saat install dis<Tab>
$ saat install discover

# View examples by domain
$ saat examples characteristics eco<Tab>
$ saat examples characteristics ecommerce

# Uninstall (shows only installed agents)
$ saat uninstall <Tab>
all  discover  generate  validate  (only installed agents shown)
```

### Zsh (Enhanced)

Zsh shows descriptions in completion menu:

```bash
$ saat <Tab>
examples   -- Show available examples
help       -- Show help documentation
install    -- Install SAAT agents to ~/.claude/agents/
list       -- List available SAAT agents
uninstall  -- Remove SAAT agents
verify     -- Verify agent installation
version    -- Show SAAT version

$ saat install <Tab>
all                      -- Install all agents
orchestrator             -- AI architecture consultant
discover                 -- Analyze existing codebases
requirements             -- Extract requirements from documents
generate                 -- Create C4 architecture models
validate                 -- Validate architecture models
analyze-characteristics  -- Evaluate architecture quality
...
```

## 🔧 Testing

### Test Bash Completion

```bash
# Enable completion debugging
export COMP_DEBUG_FILE="$HOME/saat-completion-debug.log"

# Test completion
complete -p saat

# Should output:
# complete -F _saat_completion saat
```

### Test Zsh Completion

```bash
# Check if completion is loaded
which _saat

# List completion function
typeset -f _saat

# Test completion
saat <Tab>
```

## 🐛 Troubleshooting

### Bash: Completions Not Working

**Problem**: Tab completion doesn't work after installation

**Solutions**:

1. **Check bash-completion is installed**:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install bash-completion

   # macOS
   brew install bash-completion@2
   ```

2. **Verify sourcing**:
   ```bash
   # Check if bash-completion is sourced in .bashrc
   grep bash_completion ~/.bashrc

   # Add if missing
   if [ -f /etc/bash_completion ]; then
       . /etc/bash_completion
   fi
   ```

3. **Reload shell**:
   ```bash
   exec bash
   ```

### Zsh: Completions Not Working

**Problem**: Tab completion doesn't work

**Solutions**:

1. **Check fpath**:
   ```bash
   # Should include your completions directory
   echo $fpath
   ```

2. **Rebuild completion cache**:
   ```bash
   rm -f ~/.zcompdump*
   compinit
   ```

3. **Check file naming**:
   ```bash
   # File MUST be named _saat (with underscore)
   ls ~/.zsh/completions/_saat
   ```

4. **Reload shell**:
   ```bash
   exec zsh
   ```

### Completions Show Old Agents

**Problem**: Tab completion shows agents that are no longer installed

**Solution**: Clear completion cache:

```bash
# Bash
hash -r

# Zsh
rm -f ~/.zcompdump*
compinit
```

## 🎨 Customization

### Add Custom Completions

#### Bash

Edit `saat-completion.bash` and add to the case statement:

```bash
case "${prev}" in
    my-custom-command)
        COMPREPLY=( $(compgen -W "option1 option2 option3" -- "${cur}") )
        ;;
esac
```

#### Zsh

Edit `saat-completion.zsh` and add to the arguments:

```zsh
my-custom-command)
    _values 'custom options' \
        'option1[Description 1]' \
        'option2[Description 2]' \
        'option3[Description 3]'
    ;;
```

### Change Completion Behavior

#### Bash: Case-Insensitive Completion

Add to `.bashrc`:

```bash
bind 'set completion-ignore-case on'
```

#### Zsh: Menu Selection

Add to `.zshrc`:

```zsh
# Enable menu selection
zstyle ':completion:*' menu select

# Use arrow keys for navigation
zmodload zsh/complist
bindkey -M menuselect 'h' vi-backward-char
bindkey -M menuselect 'k' vi-up-line-or-history
bindkey -M menuselect 'l' vi-forward-char
bindkey -M menuselect 'j' vi-down-line-or-history
```

## 📚 Advanced Features

### Bash: Dynamic Agent Help

Show agent description on completion (requires bash-completion 2.x):

```bash
$ saat install discover<Tab>
# Shows: Analyze existing codebases to understand their architecture
```

### Zsh: Completion Groups

Zsh automatically groups completions by category:

```bash
$ saat install <Tab>
# agents
orchestrator  discover  requirements  generate
# utilities
help  verify
```

### File Type Specific Completion

Complete only relevant files based on context:

```bash
# Architecture files
$ saat validate <Tab>
architecture.json  c4-model.json

# Characteristics files
$ saat analyze <Tab>
ecommerce-characteristics.json  healthcare-characteristics.json
```

## 🔗 Integration with Other Tools

### Git Integration

Complete from git-tracked files only:

```bash
# Add to completion script
_saat_git_files() {
    COMPREPLY=( $(compgen -W "$(git ls-files '*.json')" -- "${cur}") )
}
```

### Docker Integration

Complete with containerized saat:

```bash
alias saat='docker run --rm -it -v $(pwd):/workspace saat:latest saat'
complete -F _saat_completion saat
```

## 📊 Performance

Completion scripts are optimized for fast response:

- **Bash**: < 10ms for most completions
- **Zsh**: < 20ms with description loading
- **Cache**: Agent lists cached between completions

## 🌟 Best Practices

1. **Keep completions updated** - Reinstall after SAAT updates
2. **Test before deployment** - Verify completions work in clean shell
3. **Document custom completions** - Add comments for team members
4. **Use completion groups** (Zsh) - Organize by category
5. **Provide descriptions** (Zsh) - Help users understand options

## 📖 Resources

- [Bash Completion Guide](https://github.com/scop/bash-completion)
- [Zsh Completion System](http://zsh.sourceforge.net/Doc/Release/Completion-System.html)
- [Creating Custom Completions](https://www.gnu.org/software/bash/manual/html_node/Programmable-Completion.html)

---

**Questions?** Open an issue at https://github.com/DavidROliverBA/SAAT-ClaudeCode/issues
