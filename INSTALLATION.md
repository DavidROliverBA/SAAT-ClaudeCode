# SAAT Claude Code Sub-Agents - Installation Guide

Complete guide for installing SAAT (Solution Architects Analysis Toolkit) sub-agents globally on any laptop.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation Methods](#installation-methods)
  - [Method 1: Automated Installation (Recommended)](#method-1-automated-installation-recommended)
  - [Method 2: Manual Installation](#method-2-manual-installation)
  - [Method 3: Project-Specific Installation](#method-3-project-specific-installation)
- [Verification](#verification)
- [Usage](#usage)
- [Uninstallation](#uninstallation)
- [Troubleshooting](#troubleshooting)

---

## Overview

SAAT provides 11 specialized AI sub-agents for comprehensive solution architecture analysis:

1. **saat-orchestrate** - AI architecture consultant (start here!)
2. **saat-discover** - Analyze existing codebases
3. **saat-requirements** - Extract requirements from documents
4. **saat-generate** - Create C4 architecture models
5. **saat-analyze-characteristics** - Evaluate architecture quality
6. **saat-validate** - Validate model correctness
7. **saat-security** - Security analysis
8. **saat-document** - Generate documentation
9. **saat-terraform** - Generate Terraform infrastructure
10. **saat-full-pipeline** - Complete analysis workflow
11. **saat-help** - Help and guidance

## Prerequisites

### Required

- **Claude Code** installed and configured
  - Download from: https://www.anthropic.com/claude/code
  - Ensure Claude Code CLI is working

### Optional

- **Git** (for cloning repository)
- **curl** or **wget** (for downloading releases)

## Installation Methods

### Method 1: Automated Installation (Recommended)

Install all SAAT agents globally to `~/.claude/agents/` using the installation script.

#### Step 1: Clone or Download Repository

**Option A: Clone with Git**
```bash
git clone https://github.com/DavidROliverBA/SAAT-ClaudeCode.git
cd SAAT-ClaudeCode
```

**Option B: Download ZIP**
```bash
# Download and extract the repository
# Then navigate to the directory
cd SAAT-ClaudeCode
```

#### Step 2: Run Installation Script

```bash
./scripts/install.sh
```

#### What the Script Does

1. ✅ Checks for the `agents/` directory
2. ✅ Counts agents to install (11 total)
3. ✅ Creates `~/.claude/agents/` if it doesn't exist
4. ✅ Checks for existing SAAT agents
5. ✅ Prompts for confirmation if agents exist
6. ✅ Copies all agents to global directory
7. ✅ Reports installation summary

#### Sample Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SAAT Claude Code Sub-Agents - Global Installation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ℹ Found 11 SAAT agents to install

ℹ Creating global agents directory: /home/user/.claude/agents
✓ Directory created

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Installing SAAT Agents
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Installed: saat-orchestrate.md
✓ Installed: saat-discover.md
✓ Installed: saat-requirements.md
✓ Installed: saat-generate.md
✓ Installed: saat-analyze-characteristics.md
✓ Installed: saat-validate.md
✓ Installed: saat-security.md
✓ Installed: saat-document.md
✓ Installed: saat-terraform.md
✓ Installed: saat-full-pipeline.md
✓ Installed: saat-help.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Installation Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ All 11 agents installed successfully!

✓ Installation complete! Happy architecting! 🎉
```

---

### Method 2: Manual Installation

If you prefer manual installation or the script doesn't work, follow these steps:

#### Step 1: Create Global Agents Directory

```bash
mkdir -p ~/.claude/agents
```

#### Step 2: Copy Agent Files

```bash
# Clone or download the repository first
cd SAAT-ClaudeCode

# Copy all agents to global directory
cp agents/*.md ~/.claude/agents/
```

#### Step 3: Verify Installation

```bash
ls -la ~/.claude/agents/saat-*.md
```

You should see 11 SAAT agent files.

---

### Method 3: Project-Specific Installation

Install SAAT agents for a specific project only (not globally).

#### Step 1: Navigate to Your Project

```bash
cd /path/to/your/project
```

#### Step 2: Create Project Agents Directory

```bash
mkdir -p .claude/agents
```

#### Step 3: Copy Agent Files

```bash
# Assuming SAAT-ClaudeCode is cloned somewhere
cp /path/to/SAAT-ClaudeCode/agents/*.md .claude/agents/
```

#### Note

Project-level agents take precedence over global agents. Use this method if:
- You want different SAAT versions per project
- You're testing modifications to agents
- You don't want SAAT available globally

---

## Verification

### Check Installation

Verify agents are installed correctly:

```bash
# List all SAAT agents
ls -1 ~/.claude/agents/saat-*.md
```

Expected output:
```
/home/user/.claude/agents/saat-analyze-characteristics.md
/home/user/.claude/agents/saat-discover.md
/home/user/.claude/agents/saat-document.md
/home/user/.claude/agents/saat-full-pipeline.md
/home/user/.claude/agents/saat-generate.md
/home/user/.claude/agents/saat-help.md
/home/user/.claude/agents/saat-orchestrate.md
/home/user/.claude/agents/saat-requirements.md
/home/user/.claude/agents/saat-security.md
/home/user/.claude/agents/saat-terraform.md
/home/user/.claude/agents/saat-validate.md
```

### Test an Agent

Open Claude Code and test the help agent:

```
Using the Task tool with:
  subagent_type: "saat-help"
  prompt: "Show me available SAAT commands"
```

If successful, you'll see the SAAT help documentation.

---

## Usage

### In Claude Code

SAAT agents are invoked using the **Task** tool in Claude Code.

#### Example 1: Guided Experience (Recommended for Beginners)

```
Task tool:
  subagent_type: "saat-orchestrate"
  prompt: "I want to analyze my e-commerce platform for security and performance issues"
```

The orchestrator will ask questions and create a personalized plan.

#### Example 2: Full Pipeline Analysis

```
Task tool:
  subagent_type: "saat-full-pipeline"
  prompt: "Analyze repository at /home/user/projects/my-app with default characteristics, output to ./saat-output, using AWS"
```

Runs complete workflow: Discovery → Generation → Analysis → Validation → Security → Documentation → Terraform

#### Example 3: Discover Existing Codebase

```
Task tool:
  subagent_type: "saat-discover"
  prompt: "Analyze repository at /home/user/projects/my-app with max depth 3"
```

Generates `discovery.json` with technologies, patterns, and services.

#### Example 4: Security Analysis

```
Task tool:
  subagent_type: "saat-security"
  prompt: "Analyze architecture.json for security vulnerabilities with threat modeling enabled"
```

Generates `security-report.json` with vulnerabilities and recommendations.

### Agent Naming Convention

All SAAT agents follow the pattern: `saat-<name>`

- `saat-orchestrate` - Main orchestrator
- `saat-discover` - Discovery agent
- `saat-requirements` - Requirements agent
- ... and so on

### Getting Help

Invoke the help agent for comprehensive documentation:

```
Task tool:
  subagent_type: "saat-help"
  prompt: "Show me all SAAT commands and workflows"
```

---

## Uninstallation

### Automated Uninstallation

```bash
cd SAAT-ClaudeCode
./scripts/uninstall.sh
```

The script will:
1. Find all SAAT agents in `~/.claude/agents/`
2. List agents to be removed
3. Prompt for confirmation
4. Remove all SAAT agents

### Manual Uninstallation

```bash
# Remove all SAAT agents
rm ~/.claude/agents/saat-*.md

# Or remove specific agent
rm ~/.claude/agents/saat-orchestrate.md
```

### Verify Removal

```bash
ls ~/.claude/agents/saat-*.md
```

Should return: `No such file or directory`

---

## Troubleshooting

### Issue: Installation script says "agents/ directory not found"

**Solution**: Run the script from the SAAT-ClaudeCode root directory:
```bash
cd SAAT-ClaudeCode
./scripts/install.sh
```

### Issue: Permission denied when running installation script

**Solution**: Make the script executable:
```bash
chmod +x scripts/install.sh
./scripts/install.sh
```

### Issue: Agents not visible in Claude Code

**Possible Causes**:
1. **Claude Code not restarted** - Restart Claude Code after installation
2. **Wrong directory** - Verify agents are in `~/.claude/agents/`
3. **File permissions** - Ensure files are readable:
   ```bash
   chmod 644 ~/.claude/agents/saat-*.md
   ```

### Issue: Task tool says agent not found

**Diagnosis**:
1. Check agent exists:
   ```bash
   ls ~/.claude/agents/saat-orchestrate.md
   ```
2. Check file is valid markdown:
   ```bash
   head -20 ~/.claude/agents/saat-orchestrate.md
   ```
   Should show YAML frontmatter with `name:`, `description:`, etc.

3. Try with exact agent name from file's `name:` field

### Issue: Agent runs but produces errors

**Solution**: Check agent file has correct frontmatter format:
```yaml
---
name: saat-orchestrate
description: AI architecture consultant
tools: Read, Write, Grep, Glob, Bash, Task
model: sonnet
---
```

### Issue: Want to use different SAAT version per project

**Solution**: Use project-specific installation (Method 3) instead of global.

---

## Advanced Configuration

### Using Custom Agent Names

You can rename agents by modifying the `name:` field in the YAML frontmatter:

```yaml
---
name: my-custom-saat-orchestrator  # Changed from saat-orchestrate
description: AI architecture consultant
tools: Read, Write, Grep, Glob, Bash, Task
model: sonnet
---
```

Then invoke with:
```
Task tool:
  subagent_type: "my-custom-saat-orchestrator"
  prompt: "..."
```

### Modifying Agent Behavior

Agents are markdown files with instructions. You can customize:

1. Open agent file:
   ```bash
   nano ~/.claude/agents/saat-orchestrate.md
   ```

2. Modify the instructions section

3. Save and restart Claude Code

### Multiple Environments

Install different versions for dev/prod:

```bash
# Development version (project-specific)
cp agents/*.md /path/to/dev-project/.claude/agents/

# Production version (global)
cp agents/*.md ~/.claude/agents/
```

---

## System Requirements

### Supported Operating Systems

- ✅ **Linux** (Ubuntu, Debian, Fedora, Arch, etc.)
- ✅ **macOS** (10.15+)
- ✅ **Windows** (with WSL2 or Git Bash)

### Claude Code Versions

- **Minimum**: Claude Code v1.0
- **Recommended**: Latest version

### Disk Space

- **SAAT Agents**: < 1 MB
- **Generated Outputs**: Varies (typically 10-100 MB per analysis)

---

## Updates

### Updating SAAT Agents

To update to the latest version:

#### Method 1: Re-run Installation Script

```bash
cd SAAT-ClaudeCode
git pull  # If using Git
./scripts/install.sh
```

When prompted about existing agents, choose **Y** to overwrite.

#### Method 2: Manual Update

```bash
# Backup existing agents (optional)
cp -r ~/.claude/agents ~/.claude/agents.backup

# Copy new versions
cp SAAT-ClaudeCode/agents/*.md ~/.claude/agents/
```

### Checking Version

Currently, SAAT agents don't have version numbers in their files. To track versions:

```bash
# If using Git, check commit hash
cd SAAT-ClaudeCode
git log -1 --oneline
```

---

## Getting Help

### Documentation

- **Main Guide**: [AGENTS_GUIDE.md](./AGENTS_GUIDE.md) - Complete reference for all agents
- **Installation**: This file (INSTALLATION.md)
- **README**: [README.md](./README.md) - Project overview

### In Claude Code

```
Task tool:
  subagent_type: "saat-help"
  prompt: "Show help"
```

### Community & Support

- **GitHub Issues**: Report bugs or request features
- **GitHub Discussions**: Ask questions and share experiences

---

## License

See [LICENSE](./LICENSE) file for details.

---

## Credits

SAAT Claude Code Sub-Agents created by David R. Oliver

Based on the original SAAT (Solution Architects Analysis Toolkit) methodology.

---

**Installation complete! Start with `/saat-orchestrate` or `/saat-help` in Claude Code. Happy architecting! 🎉**
