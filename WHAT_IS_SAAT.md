# What is SAAT Claude Code?

## Claude Code: The Foundation

**Claude Code** is Anthropic's official command-line interface (CLI) for Claude AI. It's an interactive development environment that lets you work with Claude directly in your terminal to:

- Write, review, and refactor code
- Execute commands and run tests
- Search and analyze codebases
- Perform complex software engineering tasks
- Use specialized tools and agents for advanced workflows

Think of Claude Code as having an AI pair programmer in your terminal with access to your entire codebase and the ability to execute tasks autonomously.

## SAAT: The Architecture Analysis Add-On

**SAAT (Software Architecture Analysis Toolkit)** is a collection of 11 specialized slash commands (formerly sub-agents) that extend Claude Code with professional-grade software architecture capabilities.

### What Makes It an Add-On?

SAAT integrates into Claude Code's native slash command system:
- Installs globally to `~/.claude/commands/` (available across all projects)
- Uses Claude Code's built-in tools (Read, Write, Grep, Glob, Bash)
- Leverages Claude's AI to analyze, design, and document architectures
- Works seamlessly with your existing Claude Code workflows

### The Architecture Analysis Specialists

SAAT provides 11 specialized slash commands, each focused on specific architecture tasks:

---

## The 11 SAAT Commands

### 1. `/saat-orchestrator` - AI Architecture Consultant
**Purpose**: Intelligent entry point that understands your needs and creates personalized analysis plans

**Input**: Conversational description of your situation
**Output**:
- Personalized analysis plan
- Orchestrated execution of multiple agents
- Final report with key findings and recommendations

**Use When**: You're new to SAAT or need guided assistance

---

### 2. `/saat-discover` - Codebase Detective
**Purpose**: Automatically analyze existing codebases (brownfield projects)

**Input**: Repository path
**Output**: `discovery.json` containing:
```json
{
  "technologies": {
    "languages": [...],
    "frameworks": [...],
    "databases": [...]
  },
  "architecturePatterns": [...],
  "services": [...],
  "statistics": {...}
}
```

**Use When**: Analyzing existing applications, legacy systems, or unfamiliar codebases

---

### 3. `/saat-requirements` - Requirements Extractor
**Purpose**: Extract and structure requirements from business documents (greenfield projects)

**Input**: Requirements documents (PDFs, Word docs, markdown)
**Output**: `requirements.json` with:
```json
{
  "functionalRequirements": [...],
  "nonFunctionalRequirements": [...],
  "constraints": [...],
  "stakeholders": [...],
  "priorities": [...]
}
```

**Use When**: Designing new systems from business requirements

---

### 4. `/saat-generate` - C4 Model Creator
**Purpose**: Generate standardized C4 architecture models

**Input**: `discovery.json` or `requirements.json`
**Output**: `architecture.json` with:
- System Context (Level 1)
- Container Diagram (Level 2)
- Component Diagram (Level 3)
- Relationships with protocols
- Criticality levels (CS1, CS2, SL1, SL2, STANDARD)

**Use When**: Creating formal architecture documentation from analysis or requirements

---

### 5. `/saat-analyze-characteristics` - Quality Evaluator
**Purpose**: Evaluate architecture against 14 standard architecture characteristics

**Input**: `architecture.json` and optional `characteristics.json`
**Output**: Quality report analyzing:
- **Operational** (7): Availability, Scalability, Performance, Security, Reliability, Fault Tolerance, Recoverability
- **Structural** (5): Maintainability, Testability, Deployability, Configurability, Extensibility
- **Cross-Cutting** (2): Interoperability, Usability

Each with scores (1-10), evidence, and improvement recommendations

**Use When**: Assessing architecture quality, identifying weaknesses, preparing for reviews

---

### 6. `/saat-validate` - Compliance Checker
**Purpose**: Validate architecture models against standards and best practices

**Input**: `architecture.json` and optional compliance framework
**Output**: Validation report with:
- Structural correctness checks
- Best practice compliance
- Framework-specific validations (PCI-DSS, HIPAA, GDPR, SOC2)
- Issues categorized by severity (CRITICAL, HIGH, MEDIUM, LOW)

**Use When**: Ensuring compliance, preparing for audits, validating designs

---

### 7. `/saat-security` - Security Auditor
**Purpose**: Deep security analysis and threat modeling

**Input**: `architecture.json` with optional `--threat-modeling` flag
**Output**: Comprehensive security report:
- Encryption gaps (data in transit/at rest)
- Authentication/authorization issues
- Data flow vulnerabilities (SQL injection, XSS, CSRF)
- Infrastructure security gaps
- Optional: STRIDE threat model
- Attack surface map

**Use When**: Security reviews, penetration test prep, compliance assessments

---

### 8. `/saat-document` - Documentation Generator
**Purpose**: Generate comprehensive architecture documentation suite

**Input**: `architecture.json`
**Output**: Complete documentation package:
- `README.md` - System overview
- `ARCHITECTURE.md` - Detailed architecture guide
- `c4-diagrams.puml` - PlantUML C4 diagrams
- `c4-diagrams.mmd` - Mermaid diagrams (GitHub-friendly)
- `adrs/` - Architecture Decision Records
- `DEPLOYMENT.md` - Deployment guide

**Use When**: Creating documentation for teams, onboarding, or stakeholder communication

---

### 9. `/saat-terraform` - Infrastructure Generator
**Purpose**: Generate production-ready Terraform infrastructure-as-code

**Input**: `architecture.json` and target cloud (AWS/Azure/GCP)
**Output**: Complete Terraform project:
```
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── modules/
│   ├── compute/
│   ├── network/
│   ├── database/
│   └── storage/
└── environments/
    ├── dev.tfvars
    ├── staging.tfvars
    └── prod.tfvars
```

**Use When**: Automating infrastructure deployment, ensuring consistency across environments

---

### 10. `/saat-full-pipeline` - Complete Workflow
**Purpose**: Run the entire SAAT analysis workflow in one command

**Input**: Repository path or requirements document
**Output**: Everything:
- Discovery/requirements analysis
- C4 architecture model
- Quality analysis
- Validation report
- Security audit
- Complete documentation
- Terraform infrastructure

**Use When**: Quick assessments, comprehensive analysis, automated workflows

---

### 11. `/saat-help` - Interactive Help
**Purpose**: Get help and guidance on using SAAT

**Input**: None or specific question
**Output**: Command reference, examples, troubleshooting

**Use When**: Learning SAAT, looking up syntax, troubleshooting

---

## How to Use SAAT

### Installation

```bash
# 1. Clone or download the repository
git clone https://github.com/DavidROliverBA/SAAT-ClaudeCode.git
cd SAAT-ClaudeCode

# 2. Run the installation script
./scripts/install.sh

# 3. Commands are now globally available in Claude Code!
```

### Basic Usage

Open Claude Code in any project and simply type slash commands:

```bash
# Get help
/saat-help

# Guided experience (recommended for beginners)
/saat-orchestrator

# Analyze existing codebase
/saat-discover

# Run complete analysis
/saat-full-pipeline
```

### Workflow Examples

#### Example 1: Analyze Existing E-Commerce Platform

```bash
# Step 1: Type in Claude Code
/saat-discover

# Claude will prompt: "What repository path should I analyze?"
# You respond: ./my-ecommerce-app

# Step 2: After discovery completes
/saat-generate

# Claude will find discovery.json and create architecture.json

# Step 3: Security audit
/saat-security

# Step 4: Generate documentation
/saat-document
```

#### Example 2: Design New Microservices System

```bash
# Step 1: Extract requirements
/saat-requirements

# Provide requirements document path

# Step 2: Generate architecture
/saat-generate

# Step 3: Analyze quality
/saat-analyze-characteristics

# Step 4: Generate infrastructure
/saat-terraform
```

#### Example 3: Quick Assessment

```bash
# One command does everything
/saat-full-pipeline
```

---

## Real-World Use Cases

### Use Case 1: Legacy System Modernization
**Scenario**: Your company has a 10-year-old monolithic PHP application that needs modernization assessment

**Workflow**:
```bash
/saat-discover                         # Understand current architecture
/saat-analyze-characteristics          # Identify quality issues
/saat-security                         # Find security vulnerabilities
/saat-document                         # Create documentation for team
```

**Output**: Complete understanding of current state with modernization recommendations

---

### Use Case 2: Security Audit Preparation
**Scenario**: PCI-DSS audit coming up for payment processing system

**Workflow**:
```bash
/saat-discover                         # Map current architecture
/saat-security --threat-modeling       # Deep security analysis
/saat-validate PCI-DSS                 # Check compliance
/saat-document                         # Generate audit documentation
```

**Output**: Security report with findings + compliant documentation ready for auditors

---

### Use Case 3: New Cloud-Native Application
**Scenario**: Design a new microservices-based SaaS platform on AWS

**Workflow**:
```bash
/saat-requirements                     # Extract from business requirements
/saat-generate                         # Create C4 architecture
/saat-analyze-characteristics          # Optimize for scalability & performance
/saat-terraform                        # Generate AWS infrastructure
/saat-document                         # Create team documentation
```

**Output**: Complete architecture design + deployable Terraform infrastructure + documentation

---

### Use Case 4: Architecture Review
**Scenario**: Technical review before major stakeholder presentation

**Workflow**:
```bash
/saat-orchestrator                     # Guided comprehensive review

# Or manually:
/saat-discover
/saat-analyze-characteristics
/saat-validate
/saat-document
```

**Output**: Professional documentation package with quality analysis and recommendations

---

### Use Case 5: Cost Optimization
**Scenario**: Reduce cloud infrastructure costs while maintaining performance

**Workflow**:
```bash
/saat-discover                         # Understand current architecture
/saat-analyze-characteristics          # Focus on Performance, Scalability, Cost
/saat-terraform --optimize             # Generate cost-optimized infrastructure
```

**Output**: Cost optimization recommendations with infrastructure changes

---

## Key Benefits

### For Developers
- Understand unfamiliar codebases quickly
- Generate documentation automatically
- Identify technical debt
- Validate architecture decisions

### For Architects
- Create standardized C4 models
- Analyze quality characteristics
- Document architectural decisions (ADRs)
- Generate infrastructure as code

### For Security Teams
- Comprehensive security audits
- Threat modeling (STRIDE)
- Compliance validation
- Attack surface mapping

### For DevOps
- Production-ready Terraform code
- Multi-cloud support (AWS, Azure, GCP)
- Infrastructure consistency
- Environment-specific configurations

### For Teams
- Consistent documentation
- Onboarding acceleration
- Knowledge preservation
- Stakeholder communication

---

## Output Formats Summary

| Agent | Primary Output | Format |
|-------|---------------|--------|
| saat-discover | `discovery.json` | JSON |
| saat-requirements | `requirements.json` | JSON |
| saat-generate | `architecture.json` | JSON (C4 Model) |
| saat-analyze-characteristics | Quality report | Markdown + JSON |
| saat-validate | Validation report | Markdown |
| saat-security | Security audit | Markdown |
| saat-document | Documentation suite | Multiple MD files + diagrams |
| saat-terraform | Infrastructure code | Terraform (.tf files) |
| saat-full-pipeline | Complete package | All above formats |
| saat-orchestrator | Custom based on plan | Varies |
| saat-help | Reference docs | Markdown |

---

## Getting Started

1. **Install SAAT** (takes < 1 minute)
2. **Start with** `/saat-help` or `/saat-orchestrator`
3. **Try a quick analysis** with `/saat-full-pipeline`
4. **Explore specific agents** as needed

SAAT transforms Claude Code into a professional architecture analysis platform, making complex architecture tasks accessible and automated.
