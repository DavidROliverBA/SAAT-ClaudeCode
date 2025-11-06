# Healthcare Portal - HIPAA Compliance Walkthrough

Step-by-step guide for building HIPAA-compliant healthcare systems using SAAT.

---

## 🏥 HIPAA-First Architecture

This walkthrough demonstrates **compliance-driven architecture**:

- ✅ Security by default
- ✅ Privacy by design
- ✅ Audit everything
- ✅ Defense in depth

---

## Step 1: Orchestrator - Compliance Focus

**Agent**: `saat-orchestrator`

### 1.1 Invoke with Compliance Requirements

```
Task tool with:
  subagent_type: saat-orchestrator
  prompt: "I need to build a patient portal for a healthcare provider. We must
          be HIPAA compliant. The portal will provide access to medical records,
          lab results, and secure messaging. We're integrating with an existing
          Epic EHR system. What SAAT workflow should I follow?"
```

### 1.2 Expected Orchestrator Response

The orchestrator will:
1. Identify **compliance-critical** project (HIPAA)
2. Recommend **security-first** workflow
3. Emphasize validation, security, and documentation steps
4. Suggest using healthcare-specific characteristics

**Recommended workflow**:
1. Extract HIPAA requirements (`saat-requirements`)
2. Analyze EHR integration points (`saat-discover`)
3. Generate secure architecture (`saat-generate`)
4. HIPAA validation (`saat-validate` with compliance check)
5. Deep security audit (`saat-security`)
6. Generate compliance docs (`saat-document`)

---

## Step 2: Extract HIPAA Requirements

**Agent**: `saat-requirements`

### 2.1 Review Requirements Document

Open `requirements.md` - contains:
- Functional requirements (patient access, messaging, telemedicine)
- HIPAA Security Rule requirements (164.308, 164.310, 164.312)
- HIPAA Privacy Rule requirements
- Business Associate obligations

### 2.2 Run Requirements Extraction

```
Task tool with:
  subagent_type: saat-requirements
  prompt: "Extract requirements from requirements.md with focus on HIPAA
          compliance. Identify PHI protection requirements, access controls,
          audit logging, encryption, and business associate obligations.
          Output to requirements.json"
```

### 2.3 Key Requirements Identified

**Security** (HIPAA Technical Safeguards):
- FR-SEC-001: PHI encryption at rest (AES-256)
- FR-SEC-002: PHI encryption in transit (TLS 1.3)
- FR-SEC-003: Access controls (RBAC + ABAC)
- FR-SEC-004: Audit logging (all PHI access)
- FR-SEC-005: Authentication (MFA required)

**Privacy** (HIPAA Privacy Rule):
- FR-PRIV-001: Patient consent management
- FR-PRIV-002: Minimum necessary access
- FR-PRIV-003: Patient rights (access, amendment, restriction)
- FR-PRIV-004: Notice of Privacy Practices

**Audit** (HIPAA Audit Controls):
- FR-AUD-001: Log all PHI access (who, what, when)
- FR-AUD-002: Tamper-evident logs
- FR-AUD-003: Log retention (6 years)

---

## Step 3: Discover EHR Integration

**Agent**: `saat-discover`

### 3.1 Analyze EHR System

```
Task tool with:
  subagent_type: saat-discover
  prompt: "Analyze the Epic EHR integration requirements. Identify HL7 FHIR
          APIs, authentication methods, data formats, and PHI data flows.
          Document integration points and security requirements. Output to
          ehr-discovery.json"
```

### 3.2 EHR Integration Findings

**Epic FHIR API**:
- OAuth 2.0 authentication (Epic App Orchard)
- FHIR R4 resources (Patient, Observation, MedicationRequest)
- Rate limits: 10 requests/second
- PHI in responses: Requires encryption

**Integration Points**:
1. Patient demographics → FHIR Patient resource
2. Lab results → FHIR Observation resource
3. Medications → FHIR MedicationRequest resource
4. Appointments → FHIR Appointment resource

**Security Requirements**:
- VPN tunnel for on-premise Epic
- or mTLS for cloud Epic
- BAA required with Epic

---

## Step 4: Generate Secure Architecture

**Agent**: `saat-generate`

### 4.1 Run Architecture Generation

```
Task tool with:
  subagent_type: saat-generate
  prompt: "Generate HIPAA-compliant C4 architecture from requirements.json.
          Include PHI encryption, access controls, audit logging, consent
          management, and EHR integration. Mark all PHI-handling components as
          CS1 (mission critical). Output to architecture.json"
```

### 4.2 Architecture Overview

**Containers**:
1. **Patient Portal** (CS1) - Web + mobile apps
2. **API Gateway** (CS1) - Authentication, WAF, rate limiting
3. **PHI Service** (CS1) - Medical records, lab results
4. **EHR Integration** (CS1) - Epic FHIR connector
5. **Messaging Service** (CS2) - Secure patient-provider messages
6. **Telemedicine Service** (CS2) - Video consultations
7. **Consent Service** (CS1) - Patient consent tracking
8. **Audit Service** (CS1) - HIPAA audit logging
9. **Notification Service** (SL2) - Emails, SMS

**Key Security Features**:
- AES-256 encryption for all databases
- TLS 1.3 for all communication
- AWS KMS for key management
- VPC with private subnets
- WAF with HIPAA rule sets

---

## Step 5: Validate HIPAA Compliance

**Agent**: `saat-validate`

### 5.1 Run HIPAA Validation

```
Task tool with:
  subagent_type: saat-validate
  prompt: "Validate architecture.json for HIPAA compliance. Check all
          requirements from 164.308 (administrative), 164.310 (physical),
          164.312 (technical). Verify PHI encryption, access controls, audit
          logging, and business associate controls. Output to validation-report.json"
```

### 5.2 Validation Results

**Overall Score**: 94/100 ✅ **HIPAA COMPLIANT**

**Pass** (18 controls):
- ✅ 164.308(a)(1): Security Management Process
- ✅ 164.308(a)(3): Workforce Security
- ✅ 164.308(a)(4): Information Access Management
- ✅ 164.310(a): Facility Access Controls
- ✅ 164.312(a): Access Control (unique user IDs, emergency access)
- ✅ 164.312(b): Audit Controls
- ✅ 164.312(c): Integrity
- ✅ 164.312(d): Person Authentication
- ✅ 164.312(e): Transmission Security

**Warnings** (3):
1. ⚠️ Device controls partially implemented (MDM rollout incomplete)
2. ⚠️ Disaster recovery not yet tested
3. ⚠️ Annual penetration test not scheduled

**Required Actions Before Production**:
1. Complete MDM rollout (2 weeks)
2. Conduct DR test (1 week)
3. Schedule pen test (book Q2 2025)

---

## Step 6: Security Deep Dive

**Agent**: `saat-security`

### 6.1 Run HIPAA Security Audit

```
Task tool with:
  subagent_type: saat-security
  prompt: "Perform comprehensive security analysis of architecture.json. Focus
          on HIPAA Security Rule compliance. Analyze PHI data flows, encryption,
          access controls, audit logging. Include threat modeling for patient
          portal attacks. Output to security-report.json"
```

### 6.2 Security Findings

**Security Score**: 91/100 🟢

**Strengths**:
- ✅ AES-256 encryption (at rest & in transit)
- ✅ MFA enforced for all users
- ✅ Comprehensive audit logging
- ✅ Network segmentation (VPC)
- ✅ WAF with OWASP + HIPAA rules
- ✅ DDoS protection (Shield Advanced)

**Critical Issues** (0): None ✅

**High Priority** (2):

#### 1. Database Backups Not Encrypted
- **Severity**: HIGH
- **HIPAA**: Violation of 164.312(a)(2)(iv)
- **Fix**: Enable encryption for RDS snapshots
- **Effort**: 1 day

#### 2. Missing Break-the-Glass Audit Review
- **Severity**: HIGH
- **HIPAA**: 164.308(a)(1)(ii)(D) risk management
- **Fix**: Implement automated review workflow
- **Effort**: 3 days

### 6.3 Threat Model - Patient Portal

**Attack Scenario 1: PHI Data Breach**
```
Attacker Goal: Extract PHI of 10,000 patients
Attack Vector: SQL injection → database access

Mitigations:
✅ Parameterized queries (prevents SQL injection)
✅ Web Application Firewall (blocks known attacks)
✅ Encryption at rest (data unusable without keys)
✅ Access control (app uses least privilege DB user)
✅ Audit logging (intrusion detected & logged)

Result: Attack blocked at multiple layers ✅
```

**Attack Scenario 2: Account Takeover**
```
Attacker Goal: Access patient's medical records
Attack Vector: Phishing → stolen credentials

Mitigations:
✅ MFA required (password alone insufficient)
✅ Rate limiting (brute force prevented)
✅ Audit logging (suspicious access flagged)
✅ Session timeout (15 min idle timeout)
⚠️ Missing: Behavioral analytics for anomaly detection

Result: Attack likely blocked by MFA ✅
Recommendation: Add behavioral analytics
```

---

## Step 7: Analyze Characteristics

**Agent**: `saat-analyze-characteristics`

### 7.1 Healthcare-Specific Characteristics

```json
{
  "characteristics": [
    {
      "name": "Security",
      "importance": 10,
      "target": "Zero PHI breaches, HIPAA compliant",
      "reason": "Legal requirement, patient trust, breach costs $10M+"
    },
    {
      "name": "Auditability",
      "importance": 10,
      "target": "100% PHI access logged",
      "reason": "HIPAA requirement 164.312(b)"
    },
    {
      "name": "Privacy",
      "importance": 10,
      "target": "Patient consent for all sharing",
      "reason": "HIPAA Privacy Rule requirement"
    },
    {
      "name": "Reliability",
      "importance": 10,
      "target": "99.95% uptime",
      "reason": "Clinical operations cannot fail"
    }
  ]
}
```

### 7.2 Run Characteristics Analysis

```
Task tool with:
  subagent_type: saat-analyze-characteristics
  prompt: "Analyze architecture.json against healthcare-characteristics.json.
          Focus on security, auditability, privacy, and reliability. Provide
          HIPAA-specific recommendations. Output to analysis-report.json"
```

### 7.3 Analysis Results

**Overall Score**: 92/100 🟢

**Excellent** (10/10):
- ✅ Security: Comprehensive controls
- ✅ Auditability: 100% PHI access logged
- ✅ Privacy: Granular consent management
- ✅ Reliability: Multi-AZ, auto-failover

**Good** (8-9/10):
- 🟢 Performance: 200ms p95 (acceptable for healthcare)
- 🟢 Maintainability: Well-documented

**Needs Improvement** (6-7/10):
- 🟡 Interoperability: Limited HL7 v2 support (only FHIR)
- 🟡 Usability: Mobile app accessibility issues

**Recommendations**:
1. Add HL7 v2 support (for older EHR systems) - 3 weeks
2. Improve mobile accessibility (WCAG 2.1 AA) - 2 weeks

---

## Step 8: Generate Compliance Documentation

**Agent**: `saat-document`

### 8.1 Run Documentation Generation

```
Task tool with:
  subagent_type: saat-document
  prompt: "Generate HIPAA compliance documentation package from
          architecture.json. Include security risk assessment, policies and
          procedures, breach notification plan, incident response plan, business
          associate agreements, and audit reports. Output to docs/"
```

### 8.2 Generated HIPAA Documentation

```
docs/
├── hipaa-compliance-report.md      # Comprehensive compliance report
├── security-risk-assessment.md     # Annual risk assessment (164.308(a)(1))
├── policies-and-procedures/
│   ├── security-policy.md
│   ├── privacy-policy.md
│   ├── access-control-policy.md
│   ├── audit-policy.md
│   └── incident-response-policy.md
├── breach-notification-plan.md     # <60 days notification procedure
├── incident-response-plan.md       # Security incident handling
├── disaster-recovery-plan.md       # RTO 4h, RPO 1h
├── business-associate-agreements/
│   ├── aws-baa.md
│   ├── twilio-baa.md
│   └── epic-baa.md
├── training/
│   ├── annual-hipaa-training.md
│   └── training-records.csv
└── audit-reports/
    ├── access-logs-summary.md
    └── security-events-summary.md
```

### 8.3 Key Documents Review

#### Security Risk Assessment
```markdown
# HIPAA Security Risk Assessment

**Date**: 2025-11-06
**Assessor**: Solution Architect Team
**Scope**: HealthConnect Patient Portal

## Executive Summary
Overall risk: LOW
HIPAA compliance: 94%
Recommended actions: 3 (complete MDM, test DR, schedule pen test)

## Risk Analysis
[Detailed analysis of 50+ security controls...]
```

#### Breach Notification Plan
```markdown
# Breach Notification Plan

**Per 45 CFR § 164.404**

## Detection
- Automated: CloudWatch alarms for suspicious access
- Manual: Security team monitors daily

## Assessment (<24 hours)
1. Determine if breach occurred (unauthorized PHI access)
2. Identify affected individuals (from audit logs)
3. Classify severity (>500 individuals = major breach)

## Notification (<60 days)
- Individuals: Written notice via mail
- HHS: Online portal (if >500) or annual report (if <500)
- Media: If >500 individuals in same state

## Documentation
All breach records kept for 6 years (164.530(j))
```

---

## Step 9: Generate HIPAA-Compliant Infrastructure

**Agent**: `saat-terraform`

### 9.1 Run Terraform Generation

```
Task tool with:
  subagent_type: saat-terraform
  prompt: "Generate HIPAA-compliant Terraform for architecture.json on AWS.
          Use encrypted RDS (Multi-AZ), encrypted S3, VPC with private subnets,
          CloudTrail for audit, AWS Config for compliance monitoring, and KMS
          for key management. Output to terraform/"
```

### 9.2 HIPAA-Specific Terraform Resources

#### Encrypted RDS
```hcl
resource "aws_db_instance" "phi_database" {
  identifier              = "healthconnect-phi-db"
  engine                  = "postgres"
  engine_version          = "15.4"
  instance_class          = "db.r5.xlarge"
  allocated_storage       = 100
  storage_encrypted       = true                    # HIPAA required
  kms_key_id              = aws_kms_key.phi_key.arn
  multi_az                = true                     # HA requirement
  backup_retention_period = 35                       # 5 weeks retention

  enabled_cloudwatch_logs_exports = ["postgresql"]   # Audit logging

  tags = {
    HIPAA        = "true"
    PHI          = "yes"
    Criticality  = "CS1"
  }
}
```

#### KMS Key for PHI
```hcl
resource "aws_kms_key" "phi_key" {
  description             = "PHI encryption key"
  deletion_window_in_days = 30
  enable_key_rotation     = true  # Automatic 90-day rotation

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow CloudTrail to encrypt logs"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "kms:GenerateDataKey*"
        Resource = "*"
      }
    ]
  })
}
```

#### CloudTrail (HIPAA Audit)
```hcl
resource "aws_cloudtrail" "hipaa_audit" {
  name                          = "healthconnect-hipaa-audit"
  s3_bucket_name                = aws_s3_bucket.audit_logs.id
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_log_file_validation    = true  # Tamper-evident logs
  kms_key_id                    = aws_kms_key.phi_key.arn

  event_selector {
    read_write_type           = "All"
    include_management_events = true

    data_resource {
      type   = "AWS::S3::Object"
      values = ["${aws_s3_bucket.phi_storage.arn}/*"]  # Track PHI access
    }
  }
}
```

### 9.3 Deploy HIPAA Infrastructure

```bash
cd terraform/

# Initialize
terraform init

# Plan (review carefully!)
terraform plan -var="environment=production" -var="enable_hipaa_mode=true" -out=hipaa.tfplan

# Review resources (~180 resources for HIPAA compliance)

# Apply (WARNING: Creates real AWS resources)
terraform apply hipaa.tfplan
```

**Estimated Cost**: $9,220/month + $8,000/month compliance = **$17,220/month**

---

## Step 10: HIPAA Compliance Checklist

### 10.1 Pre-Production Checklist

**Administrative Safeguards**:
- [x] Security management process (risk assessment, policies)
- [x] Assigned security responsibility (CISO designated)
- [x] Workforce security (background checks, access termination)
- [x] Information access management (RBAC implementation)
- [x] Security awareness training (annual training completed)
- [x] Security incident procedures (incident response plan)
- [x] Contingency plan (disaster recovery plan)
- [x] Evaluation (annual security audit scheduled)
- [x] Business associate contracts (BAAs signed)

**Physical Safeguards**:
- [x] Facility access controls (AWS SOC 2 certified DCs)
- [x] Workstation use (device security policy)
- [ ] Workstation security (MDM rollout 80% complete) ⚠️
- [x] Device and media controls (encryption enforced)

**Technical Safeguards**:
- [x] Access control (unique user IDs, MFA, encryption)
- [x] Audit controls (comprehensive logging)
- [x] Integrity (checksums, digital signatures)
- [x] Person authentication (OAuth 2.0 + MFA)
- [x] Transmission security (TLS 1.3)

**HIPAA Privacy Rule**:
- [x] Notice of Privacy Practices
- [x] Patient rights (access, amendment, restriction)
- [x] Uses and disclosures (consent management)
- [x] Minimum necessary standard
- [x] Business associate agreements

### 10.2 Production Readiness

**Status**: ⚠️ **90% Ready** (3 items to complete)

**Blocking Items**:
1. Complete MDM device enrollment (2 weeks)
2. Conduct disaster recovery test (1 week)
3. Schedule annual penetration test (book slot)

**Estimated Time to Production**: 3-4 weeks

---

## 🎓 What You Learned

HIPAA compliance architecture skills:

1. ✅ HIPAA Security Rule requirements (164.308, 164.310, 164.312)
2. ✅ PHI protection strategies (encryption, access control)
3. ✅ Audit logging for compliance
4. ✅ Break-the-glass emergency access
5. ✅ Business Associate Agreements (BAAs)
6. ✅ Breach notification procedures
7. ✅ HIPAA-compliant AWS infrastructure
8. ✅ Risk assessment methodology

---

## 🚀 Next Steps

### Before Production (3-4 weeks)

1. **Complete MDM Rollout** (2 weeks)
   - Enroll all devices in Intune/Jamf
   - Enforce encryption policies
   - Test remote wipe

2. **Disaster Recovery Test** (1 week)
   - Fail over to secondary region
   - Verify RTO < 4 hours, RPO < 1 hour
   - Document results

3. **Penetration Testing** (schedule Q2)
   - Hire qualified HIPAA pen tester
   - Scope: Patient portal, APIs, EHR integration
   - Remediate findings

### Post-Production (Ongoing)

4. **Annual HIPAA Training** - All workforce members
5. **Annual Risk Assessment** - Required by 164.308(a)(1)
6. **Quarterly Access Reviews** - Review user permissions
7. **Monthly Security Scans** - Automated vulnerability scanning
8. **Continuous Monitoring** - SIEM, anomaly detection

---

## ⚠️ IMPORTANT: This Is NOT Legal Advice

**Disclaimer**:
- This walkthrough provides architectural guidance only
- HIPAA compliance requires legal, security, and compliance expertise
- Always consult with qualified HIPAA attorneys and assessors
- Conduct formal risk assessments before production
- Maintain comprehensive documentation

**Resources**:
- HHS HIPAA website: https://www.hhs.gov/hipaa
- NIST Special Publication 800-66: Guide to HIPAA Security
- HITRUST CSF: Healthcare security framework

---

**Congratulations!** 🎉

You've learned how to architect HIPAA-compliant healthcare systems using SAAT!

**Next Steps**:
- Review all three walkthroughs (E-commerce, Gateway, Healthcare)
- Adapt patterns to your specific project
- Engage qualified compliance consultants
- Conduct formal risk assessments
