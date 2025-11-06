# SAAT Claude Code Sub-Agents

**Solution Architects Analysis Toolkit for Claude Code**

A comprehensive suite of 11 specialized AI sub-agents that provide professional-grade software architecture analysis, design, validation, security assessment, documentation, and infrastructure generation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude-Code-blue.svg)](https://www.anthropic.com/claude/code)

---

## 🎯 What is SAAT?

SAAT (Solution Architects Analysis Toolkit) provides AI-powered architecture analysis through specialized sub-agents that can:

- 🔍 **Discover** existing codebases and identify architecture patterns
- 📋 **Extract** requirements from business documents
- 🏗️ **Generate** standardized C4 architecture models
- 📊 **Analyze** quality against 14 architecture characteristics
- ✅ **Validate** models for correctness and compliance
- 🔒 **Audit** security and identify vulnerabilities
- 📚 **Document** architecture with diagrams and ADRs
- 🏗️ **Generate** production-ready Terraform infrastructure
- 🎯 **Orchestrate** complete workflows tailored to your needs

---

## 🚀 Installation

### Prerequisites

Before installing SAAT, ensure you have:

- ✅ **Claude Code** installed and configured ([Download here](https://www.anthropic.com/claude/code))
- ✅ **Bash shell** (Linux, macOS, or Windows with WSL2/Git Bash)
- ✅ **Git** (optional, for cloning - or download ZIP from GitHub)

### Quick Install (Recommended)

**Step 1: Get the repository**

```bash
# Option A: Clone with Git
git clone https://github.com/DavidROliverBA/SAAT-ClaudeCode.git
cd SAAT-ClaudeCode

# Option B: Download and extract ZIP, then:
cd SAAT-ClaudeCode
```

**Step 2: Run the installation script**

```bash
./scripts/install.sh
```

**What happens during installation:**
- ✅ Creates `~/.claude/agents/` directory (if it doesn't exist)
- ✅ Copies all 11 SAAT agents globally
- ✅ Makes agents available across all your projects
- ✅ Takes less than 1 minute!

**Step 3: Verify installation**

```bash
# Check that agents are installed
ls -1 ~/.claude/agents/saat-*.md

# You should see 11 agent files
```

### Alternative Installation Methods

<details>
<summary><b>Manual Installation</b> (click to expand)</summary>

```bash
# Clone or download repository
cd SAAT-ClaudeCode

# Create global agents directory
mkdir -p ~/.claude/agents

# Copy all agents
cp agents/*.md ~/.claude/agents/

# Verify
ls -la ~/.claude/agents/saat-*.md
```
</details>

<details>
<summary><b>Project-Specific Installation</b> (click to expand)</summary>

Install to a specific project instead of globally:

```bash
# Navigate to your project
cd /path/to/your/project

# Create project agents directory
mkdir -p .claude/agents

# Copy agents from SAAT repository
cp /path/to/SAAT-ClaudeCode/agents/*.md .claude/agents/

# Agents now available only in this project
```

**Note:** Project-level agents take precedence over global agents.
</details>

<details>
<summary><b>Windows (PowerShell) Installation</b> (click to expand)</summary>

```powershell
# Clone repository
git clone https://github.com/DavidROliverBA/SAAT-ClaudeCode.git
cd SAAT-ClaudeCode

# Create agents directory
New-Item -Path "$env:USERPROFILE\.claude\agents" -ItemType Directory -Force

# Copy agents
Copy-Item -Path "agents\*.md" -Destination "$env:USERPROFILE\.claude\agents\"

# Verify
Get-ChildItem "$env:USERPROFILE\.claude\agents\saat-*.md"
```
</details>

### First Use

Open **Claude Code** and invoke your first agent:

**Method 1: Guided Experience (Recommended for beginners)**
```
In Claude Code, use the Task tool:
  subagent_type: "saat-orchestrate"
  prompt: "I want to analyze my e-commerce platform for security and performance"
```

**Method 2: Get Help**
```
Task tool:
  subagent_type: "saat-help"
  prompt: "Show me all available SAAT commands"
```

**Method 3: Quick Full Analysis**
```
Task tool:
  subagent_type: "saat-full-pipeline"
  prompt: "Analyze /path/to/my/project"
```

The orchestrator will guide you through a personalized analysis workflow!

### Troubleshooting Installation

**Issue:** Script says "permission denied"
```bash
chmod +x scripts/install.sh
./scripts/install.sh
```

**Issue:** Agents not showing in Claude Code
- Restart Claude Code after installation
- Verify files exist: `ls ~/.claude/agents/saat-*.md`
- Check file permissions: `chmod 644 ~/.claude/agents/saat-*.md`

**For more help:** See [INSTALLATION.md](./INSTALLATION.md) for comprehensive troubleshooting.

---

## 📦 What's Included

### 11 Specialized Sub-Agents

| Agent | Purpose | Use Case |
|-------|---------|----------|
| **saat-orchestrate** | AI architecture consultant | Start here! Guided experience |
| **saat-discover** | Analyze existing codebases | Brownfield analysis |
| **saat-requirements** | Extract requirements | Greenfield design |
| **saat-generate** | Create C4 models | Architecture modeling |
| **saat-analyze-characteristics** | Evaluate quality | Quality assessment |
| **saat-validate** | Validate models | Correctness checking |
| **saat-security** | Security analysis | Vulnerability assessment |
| **saat-document** | Generate documentation | Documentation suite |
| **saat-terraform** | Generate infrastructure | Infrastructure as Code |
| **saat-full-pipeline** | Complete workflow | One-command analysis |
| **saat-help** | Help & guidance | Reference documentation |

---

## 🎓 Use Cases

### 1. Analyze Existing Application (Brownfield)

```
Task(subagent_type="saat-discover", prompt="Analyze /path/to/my-app")
→ Task(subagent_type="saat-generate", prompt="Generate C4 from discovery.json")
→ Task(subagent_type="saat-security", prompt="Analyze security")
```

Or use the full pipeline:
```
Task(subagent_type="saat-full-pipeline", prompt="Analyze /path/to/my-app")
```

### 2. Design New System (Greenfield)

```
Task(subagent_type="saat-requirements", prompt="Extract from requirements.md")
→ Task(subagent_type="saat-generate", prompt="Generate C4 from requirements.json")
→ Task(subagent_type="saat-document", prompt="Create documentation")
```

### 3. Security Audit

```
Task(subagent_type="saat-security", prompt="Analyze architecture.json with threat modeling")
```

### 4. Architecture Review

```
Task(subagent_type="saat-analyze-characteristics", prompt="Analyze architecture.json against characteristics.json")
→ Task(subagent_type="saat-validate", prompt="Validate architecture.json for PCI-DSS")
```

### 5. Infrastructure Generation

```
Task(subagent_type="saat-terraform", prompt="Generate AWS infrastructure from architecture.json")
```

---

## 📊 Architecture Characteristics

SAAT evaluates **14 standard architecture characteristics** based on Mark Richards' methodology:

### Operational (7)
- Availability, Scalability, Performance, Security, Reliability, Fault Tolerance, Recoverability

### Structural (5)
- Maintainability, Testability, Deployability, Configurability, Extensibility

### Cross-Cutting (2)
- Interoperability, Usability

---

## 🏗️ Features

### C4 Model Generation
- ✅ Level 1 (Systems)
- ✅ Level 2 (Containers)
- ✅ Level 3 (Components)
- ✅ Relationships with protocols
- ✅ Criticality levels (CS1, CS2, SL1, SL2, STANDARD)

### Compliance Frameworks
- ✅ PCI-DSS (Payment Card Industry)
- ✅ HIPAA (Healthcare)
- ✅ GDPR (Data Protection)
- ✅ SOC2 (Security Controls)

### Multi-Cloud Infrastructure
- ✅ AWS (Amazon Web Services)
- ✅ Azure (Microsoft Azure)
- ✅ GCP (Google Cloud Platform)

### Documentation Formats
- ✅ Markdown (README, ARCHITECTURE)
- ✅ PlantUML (C4 diagrams)
- ✅ Mermaid (GitHub-friendly diagrams)
- ✅ ADRs (Architecture Decision Records)

### Security Analysis
- ✅ Encryption gaps
- ✅ Authentication/authorization issues
- ✅ Data flow security
- ✅ Infrastructure vulnerabilities
- ✅ Threat modeling (STRIDE)
- ✅ Attack surface mapping

---

## 📖 Documentation

- **[Installation Guide](./INSTALLATION.md)** - Complete installation instructions
- **[Agents Guide](./AGENTS_GUIDE.md)** - Comprehensive reference for all agents
- **Examples** - See `examples/` directory for sample files

---

## 🔧 Requirements

### Required
- **Claude Code** (latest version recommended)
- Operating System: Linux, macOS, or Windows (WSL2/Git Bash)

### Optional
- **Git** (for cloning repository)
- **Terraform** (for infrastructure deployment)
- **Cloud CLI** (AWS CLI, Azure CLI, gcloud - for infrastructure deployment)

---

## 💡 Example Workflows

### Quick Assessment (5-10 minutes)

```bash
Task(
  subagent_type="saat-full-pipeline",
  prompt="Analyze /home/user/projects/my-app, output to ./analysis, use AWS"
)
```

**Generates**:
- ✅ discovery.json
- ✅ architecture.json
- ✅ Quality analysis report
- ✅ Validation report
- ✅ Security audit
- ✅ Complete documentation
- ✅ Terraform infrastructure

### Guided Experience (10-15 minutes)

```bash
Task(
  subagent_type="saat-orchestrate",
  prompt="I need to analyze my system for modernization"
)
```

The orchestrator will:
1. Ask about your situation
2. Understand your concerns
3. Create a personalized plan
4. Execute the workflow
5. Deliver actionable recommendations

### Custom Workflow

```bash
# Step 1: Discover
Task(subagent_type="saat-discover", prompt="Analyze /path/to/repo")

# Step 2: Generate C4
Task(subagent_type="saat-generate", prompt="Generate from discovery.json")

# Step 3: Analyze Quality
Task(subagent_type="saat-analyze-characteristics", prompt="Analyze against characteristics.json")

# Step 4: Security Audit
Task(subagent_type="saat-security", prompt="Deep security analysis with threat modeling")

# Step 5: Document
Task(subagent_type="saat-document", prompt="Generate complete documentation")
```

---

## 🗂️ Project Structure

```
SAAT-ClaudeCode/
├── agents/                         # Sub-agent definitions (11 agents)
│   ├── saat-orchestrate.md
│   ├── saat-discover.md
│   ├── saat-requirements.md
│   ├── saat-generate.md
│   ├── saat-analyze-characteristics.md
│   ├── saat-validate.md
│   ├── saat-security.md
│   ├── saat-document.md
│   ├── saat-terraform.md
│   ├── saat-full-pipeline.md
│   └── saat-help.md
├── scripts/                        # Installation scripts
│   ├── install.sh                  # Global installation
│   └── uninstall.sh                # Uninstallation
├── examples/                       # Example files (coming soon)
│   ├── archchar-ecommerce.json     # Sample characteristics
│   ├── discovery-sample.json       # Sample discovery output
│   └── architecture-sample.json    # Sample C4 model
├── INSTALLATION.md                 # Installation guide
├── AGENTS_GUIDE.md                 # Complete agents reference
└── README.md                       # This file
```

---

## 🗑️ Uninstallation

If you need to remove SAAT agents:

### Automated Uninstallation

```bash
cd SAAT-ClaudeCode
./scripts/uninstall.sh
```

The script will:
- List all SAAT agents to be removed
- Ask for confirmation
- Remove all agents from `~/.claude/agents/`

### Manual Uninstallation

```bash
# Remove all SAAT agents
rm ~/.claude/agents/saat-*.md

# Or remove specific agent
rm ~/.claude/agents/saat-orchestrator.md
```

### Verify Removal

```bash
ls ~/.claude/agents/saat-*.md
# Should return: No such file or directory
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Development

To test agents locally before installation:

```bash
# Copy to project-specific directory
mkdir -p .claude/agents
cp agents/*.md .claude/agents/
```

---

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Credits

**Created by**: David R. Oliver

**Based on**: Solution Architects Analysis Toolkit (SAAT) methodology

**Powered by**: Claude Code by Anthropic

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/DavidROliverBA/SAAT-ClaudeCode/issues)
- **Discussions**: [GitHub Discussions](https://github.com/DavidROliverBA/SAAT-ClaudeCode/discussions)

---

## 🎯 Next Steps

1. **Install**: Run `./scripts/install.sh`
2. **Learn**: Read [AGENTS_GUIDE.md](./AGENTS_GUIDE.md)
3. **Try**: Invoke `saat-orchestrate` in Claude Code
4. **Explore**: Run `saat-help` for all commands

---

**Ready to revolutionize your architecture analysis? Install SAAT and start architecting! 🚀**

```bash
./scripts/install.sh
```

Then in Claude Code:
```
Task(subagent_type="saat-help", prompt="Show me what you can do")
```

Happy architecting! 🎉
