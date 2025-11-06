# SAAT Examples & Templates

Complete collection of examples and templates to help you get started with SAAT (Solution Architects Analysis Toolkit).

---

## 📁 Directory Structure

```
examples/
├── characteristics/          # Architecture characteristics files for different domains
│   ├── ecommerce-characteristics.json
│   ├── healthcare-characteristics.json
│   ├── fintech-characteristics.json
│   ├── saas-characteristics.json
│   └── microservices-characteristics.json
├── requirements/            # Sample requirements documents
│   └── ecommerce-requirements.md
├── sample-outputs/          # Example outputs from SAAT agents
│   ├── discovery-sample.json
│   └── architecture-sample.json
├── workflows/               # Complete workflow examples (coming soon)
└── README.md               # This file
```

---

## 🎯 Quick Start

### Using Characteristics Files

Architecture characteristics files define the quality attributes your system must meet. Use them with the `saat-analyze-characteristics` agent:

```bash
# In Claude Code, use Task tool:
Task(
  subagent_type="saat-analyze-characteristics",
  prompt="Analyze architecture.json against examples/characteristics/ecommerce-characteristics.json"
)
```

### Using Requirements Documents

Requirements documents are inputs for greenfield (new) projects. Use them with the `saat-requirements` agent:

```bash
Task(
  subagent_type="saat-requirements",
  prompt="Extract requirements from examples/requirements/ecommerce-requirements.md"
)
```

### Viewing Sample Outputs

Sample outputs show what to expect from SAAT agents:

- **discovery-sample.json** - Output from analyzing an existing codebase
- **architecture-sample.json** - Generated C4 architecture model

---

## 📊 Characteristics Files

### 1. E-Commerce Platform (`ecommerce-characteristics.json`)

**Domain**: Online Retail
**Key Focus**: High availability, performance, security (PCI-DSS)

**When to use**:
- Building online shopping platforms
- High-traffic retail websites
- Payment processing systems

**Top Priorities**:
- **Availability** (10/10): 99.9% uptime - revenue loss during downtime
- **Performance** (9/10): Fast page loads critical for conversion
- **Security** (10/10): PCI-DSS compliance required
- **Scalability** (9/10): Black Friday traffic spikes

**Compliance**: PCI-DSS Level 1, GDPR, CCPA

---

### 2. Healthcare Patient Portal (`healthcare-characteristics.json`)

**Domain**: Healthcare/Medical
**Key Focus**: HIPAA compliance, security, reliability

**When to use**:
- Patient portals and health records systems
- Telemedicine platforms
- Healthcare data management

**Top Priorities**:
- **Security** (10/10): HIPAA Technical Safeguards, PHI protection
- **Reliability** (9/10): Medical data integrity critical
- **Recoverability** (9/10): Zero data loss acceptable
- **Interoperability** (9/10): HL7 FHIR integration

**Compliance**: HIPAA, HITECH, SOC 2 Type II, 21 CFR Part 11

---

### 3. FinTech Payment Platform (`fintech-characteristics.json`)

**Domain**: Financial Technology
**Key Focus**: Real-time transactions, security, regulatory compliance

**When to use**:
- Payment processing platforms
- Digital wallets
- Banking applications
- Cryptocurrency exchanges

**Top Priorities**:
- **Availability** (10/10): 99.99% uptime - 24/7 global transactions
- **Performance** (10/10): Sub-second payment processing
- **Security** (10/10): Military-grade security, zero breaches
- **Reliability** (10/10): Zero data loss, 99.99% transaction success

**Compliance**: PCI-DSS Level 1, SOC 2 Type II, ISO 27001, AML/KYC, BSA

---

### 4. SaaS Analytics Platform (`saas-characteristics.json`)

**Domain**: Software as a Service
**Key Focus**: Multi-tenancy, scalability, configurability

**When to use**:
- SaaS applications
- Multi-tenant platforms
- Business intelligence tools
- Analytics dashboards

**Top Priorities**:
- **Scalability** (10/10): Multi-tenant elastic scaling
- **Configurability** (10/10): Per-tenant customization
- **Deployability** (9/10): Continuous deployment multiple times daily
- **Extensibility** (9/10): Plugin marketplace, integrations

**Compliance**: SOC 2 Type II, ISO 27001, GDPR, CCPA

---

### 5. Microservices Platform (`microservices-characteristics.json`)

**Domain**: Cloud-Native Architecture
**Key Focus**: Independent deployability, fault tolerance, observability

**When to use**:
- Microservices architectures
- Event-driven systems
- Service mesh implementations
- Distributed systems

**Top Priorities**:
- **Scalability** (10/10): Independent service scaling
- **Deployability** (10/10): Deploy services independently
- **Fault Tolerance** (10/10): Circuit breakers, graceful degradation
- **Interoperability** (9/10): REST/gRPC, event-driven messaging

**Architecture Patterns**: Event sourcing, CQRS, Saga pattern, Service mesh

---

## 📋 Requirements Documents

### E-Commerce Requirements (`ecommerce-requirements.md`)

Comprehensive requirements document for an online retail platform.

**Includes**:
- **Functional Requirements** (50+): User management, product catalog, shopping cart, checkout, order management, admin panel
- **Non-Functional Requirements** (12+): Performance, availability, security, scalability, reliability, maintainability, usability, compliance
- **Technical Constraints**: AWS infrastructure, budget, team size, integrations
- **User Stories** (5+): Customer and admin perspectives
- **Success Metrics**: Conversion rate, uptime, performance targets
- **Risks and Mitigations**: PCI-DSS certification, traffic spikes, security

**Use this as**:
- Template for your own requirements
- Input to `saat-requirements` agent
- Reference for requirement structure

---

## 📤 Sample Outputs

### Discovery Sample (`discovery-sample.json`)

**What it shows**: Output from running `saat-discover` on an e-commerce codebase

**Includes**:
- **Technologies found**: TypeScript, JavaScript, Python, React, Express, FastAPI, PostgreSQL, Redis, Elasticsearch
- **Architecture patterns**: Microservices (85% confidence), Event-Driven (75%), RESTful API (100%)
- **Services identified** (6): user-service, payment-service, order-service, inventory-service, notification-service, web-app
- **External dependencies**: Stripe, SendGrid, AWS S3, Twilio
- **Statistics**: 1,523 files, 152K lines of code
- **DevOps**: Docker, Kubernetes, GitHub Actions, Prometheus, Grafana
- **Recommendations**: API documentation, distributed tracing, service mesh, etc.

**Use this to**:
- Understand what discovery agent produces
- See confidence scoring in action
- Learn pattern detection approach

---

### Architecture Sample (`architecture-sample.json`)

**What it shows**: C4 model generated from discovery results

**Includes**:
- **Systems** (3): Main platform + 2 external systems (Stripe, SendGrid)
- **Containers** (11): Web app, API gateway, 5 microservices, PostgreSQL, Redis, Kafka, Elasticsearch
- **Relationships** (13): Service-to-service communication with protocols
- **Criticality levels**: CS1 (mission critical), CS2 (business critical), SL1 (standard)
- **Ownership**: Team assignments for each container

**Use this to**:
- Understand C4 model structure
- See how discovery maps to C4
- Learn criticality assignment
- Template for manual C4 models

---

## 🎓 Learning Paths

### Beginner: First SAAT Analysis

1. **Start with characteristics**: Review `ecommerce-characteristics.json` to understand the 14 characteristics
2. **Read requirements**: Study `ecommerce-requirements.md` to see how requirements map to characteristics
3. **View sample outputs**: Examine `discovery-sample.json` and `architecture-sample.json`
4. **Run help agent**: `Task(subagent_type="saat-help", prompt="Show me workflows")`
5. **Try orchestrator**: `Task(subagent_type="saat-orchestrate", prompt="Guide me through analysis")`

### Intermediate: Brownfield Analysis

1. **Choose characteristics file**: Select domain matching your system (e.g., saas-characteristics.json)
2. **Run discovery**: Analyze your codebase
3. **Generate C4 model**: Convert discovery to architecture
4. **Analyze characteristics**: Compare against selected characteristics
5. **Review recommendations**: Prioritize improvements

### Advanced: Greenfield Design

1. **Create requirements document**: Use ecommerce-requirements.md as template
2. **Define characteristics**: Customize from provided examples
3. **Extract requirements**: Use saat-requirements agent
4. **Generate architecture**: Create C4 model from requirements
5. **Validate and secure**: Run validation and security analysis
6. **Document**: Generate complete documentation suite
7. **Infrastructure**: Generate Terraform for deployment

---

## 🔧 Customizing Examples

### Modify Characteristics

1. Copy a characteristics file: `cp ecommerce-characteristics.json my-project-characteristics.json`
2. Update the following:
   - `projectName` and `description`
   - `importance` (1-10 scale) for each characteristic
   - `target` values to match your requirements
   - `businessContext` with your details
   - `technicalConstraints` with your environment
3. Use your custom file with SAAT agents

### Create Custom Requirements

1. Use `ecommerce-requirements.md` as template
2. Update sections:
   - Executive Summary → Your project goals
   - Stakeholders → Your team
   - Functional Requirements → Your features
   - Non-Functional Requirements → Your quality targets
   - Technical Constraints → Your environment
3. Add domain-specific sections as needed

---

## 📚 Domain-Specific Guidance

### For E-Commerce Projects
**Use**: `ecommerce-characteristics.json` + `ecommerce-requirements.md`
**Focus on**: Performance (conversion), Security (PCI-DSS), Scalability (traffic spikes)
**Key considerations**: Payment processing, inventory management, seasonal traffic

### For Healthcare Projects
**Use**: `healthcare-characteristics.json`
**Focus on**: Security (HIPAA), Reliability (data integrity), Interoperability (HL7 FHIR)
**Key considerations**: PHI protection, audit logging, disaster recovery

### For FinTech Projects
**Use**: `fintech-characteristics.json`
**Focus on**: Security (multi-layered), Performance (real-time), Reliability (zero data loss)
**Key considerations**: Regulatory compliance, fraud detection, transaction processing

### For SaaS Projects
**Use**: `saas-characteristics.json`
**Focus on**: Configurability (multi-tenant), Deployability (CI/CD), Extensibility (integrations)
**Key considerations**: Tenant isolation, customization, billing/metering

### For Microservices Projects
**Use**: `microservices-characteristics.json`
**Focus on**: Deployability (independent), Fault Tolerance (resilience), Interoperability (service mesh)
**Key considerations**: Service boundaries, communication patterns, observability

---

## 🎯 Best Practices

### Characteristics Files
- ✅ Set importance (1-10) based on business impact, not technical preference
- ✅ Define measurable targets (e.g., "99.9% uptime", not "high availability")
- ✅ Include rationale for each characteristic
- ✅ Map characteristics to business scenarios
- ✅ Review and update characteristics as project evolves

### Requirements Documents
- ✅ Start with business objectives before technical requirements
- ✅ Use acceptance criteria for all functional requirements
- ✅ Quantify non-functional requirements (numbers, percentages)
- ✅ Identify assumptions and risks early
- ✅ Get stakeholder approval before development starts

### Using SAAT
- ✅ Start with orchestrator if unsure: `/saat-orchestrate`
- ✅ Validate before proceeding to next step
- ✅ Address CRITICAL issues before production
- ✅ Use characteristics analysis to prioritize work
- ✅ Version control all SAAT outputs (JSON files)

---

## 🆘 Troubleshooting

**Q: Which characteristics file should I use?**
A: Choose based on your domain. If uncertain, start with `microservices-characteristics.json` (most comprehensive) and customize.

**Q: Can I combine characteristics from multiple files?**
A: Yes! Copy relevant characteristics from each domain file into a custom file.

**Q: My project doesn't fit any domain. What do I do?**
A: Start with the closest match, then customize. All 14 characteristics are relevant to every project - adjust importance and targets.

**Q: How do I know if my targets are realistic?**
A: Compare against:
- Industry standards (e.g., 99.9% = industry standard, 99.99% = high-end)
- Similar systems in your organization
- Examples in this directory
- Consult with experienced architects

**Q: Should I aim for 10/10 importance on everything?**
A: No! Trade-offs are essential. High ratings (9-10) should be reserved for true business-critical characteristics. Most should be 6-8.

---

## 💡 Tips & Tricks

1. **Start small**: Use one characteristics file for first analysis, expand later
2. **Iterate**: Run analysis, address gaps, re-run to verify improvements
3. **Compare**: Run same architecture against different characteristics files to see trade-offs
4. **Document decisions**: Create ADRs (Architecture Decision Records) for major changes
5. **Track over time**: Store SAAT outputs in git to see architecture evolution
6. **Share with team**: Use characteristics files to align team on quality attributes
7. **Educate stakeholders**: Use sample outputs to explain architecture to non-technical stakeholders

---

## 📖 Further Reading

- [AGENTS_GUIDE.md](../AGENTS_GUIDE.md) - Complete reference for all SAAT agents
- [INSTALLATION.md](../INSTALLATION.md) - Installation instructions
- [ROADMAP.md](../ROADMAP.md) - Future development plans
- [Mark Richards - Software Architecture: The Hard Parts](https://www.oreilly.com/library/view/software-architecture-the/9781492086888/) - Architecture characteristics methodology

---

## 🤝 Contributing Examples

Have a great example to share? We'd love to include it!

**To contribute**:
1. Create characteristics file for your domain
2. Add sample requirements document (if applicable)
3. Include README section explaining when to use it
4. Submit pull request with description

**What makes a good example**:
- Real-world, production-inspired scenarios
- Complete, not abbreviated
- Well-documented with rationale
- Demonstrates domain-specific concerns
- Includes measurable targets

---

## 📝 License

All examples are provided under MIT License and can be freely used as templates for your projects.

---

**Ready to start? Pick a characteristics file matching your domain and begin your SAAT journey!** 🚀

For questions or help, see the main [README.md](../README.md) or invoke the `saat-help` agent.
