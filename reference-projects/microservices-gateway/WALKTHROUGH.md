# Microservices API Gateway - Greenfield Walkthrough

Step-by-step guide for building an API gateway from requirements using SAAT.

---

## 🎯 Greenfield vs. Brownfield

**Greenfield Workflow** (this walkthrough):
- ✅ Start from business requirements
- ✅ No existing codebase to analyze
- ✅ Design architecture from scratch
- ✅ Use `saat-requirements` instead of `saat-discover`

**Brownfield Workflow** (see e-commerce):
- Analyze existing codebase
- Modernize/refactor existing system
- Use `saat-discover` agent

---

## Step 1: Initial Consultation

**Agent**: `saat-orchestrator`

### 1.1 Invoke Orchestrator

```
Task tool with:
  subagent_type: saat-orchestrator
  prompt: "I need to build a high-performance API gateway for our microservices
          platform. We have 50+ services and need unified authentication, rate
          limiting, and monitoring. This is a new project. What workflow should
          I follow?"
```

### 1.2 Expected Response

The orchestrator will:
1. Identify this as **greenfield**
2. Recommend starting with `saat-requirements`
3. Focus on Performance, Scalability, Security characteristics
4. Suggest performance-first architecture patterns

---

## Step 2: Extract Requirements

**Agent**: `saat-requirements`
**Input**: `requirements.md` (business requirements document)

### 2.1 Prepare Requirements Document

Open `requirements.md` in this directory. It contains:
- Functional requirements (FR-001 to FR-025)
- Non-functional requirements (NFR-001 to NFR-015)
- User stories
- Constraints

### 2.2 Run Requirements Extraction

```
Task tool with:
  subagent_type: saat-requirements
  prompt: "Extract and structure requirements from requirements.md. Identify
          functional requirements, non-functional requirements, user stories,
          and constraints. Output to requirements.json"
```

### 2.3 Review Structured Requirements

Open generated `requirements.json`:

```json
{
  "functionalRequirements": [
    {
      "id": "FR-001",
      "title": "Request Routing",
      "description": "Route requests to appropriate backend services",
      "priority": "CRITICAL"
    },
    {
      "id": "FR-002",
      "title": "Authentication",
      "description": "Support OAuth 2.0 and API key authentication",
      "priority": "CRITICAL"
    }
    // ... 23 more
  ],
  "nonFunctionalRequirements": [
    {
      "id": "NFR-001",
      "category": "Performance",
      "requirement": "Sub-10ms p99 latency overhead",
      "measurement": "p99 latency < 10ms",
      "criticality": "HIGH"
    }
    // ... 14 more
  ]
}
```

**Key Requirements Identified**:
- 🎯 Performance: <10ms p99 latency
- 🎯 Scalability: 100K req/sec
- 🎯 Availability: 99.99% uptime
- 🎯 Security: OAuth 2.0, rate limiting, WAF

---

## Step 3: Generate Architecture

**Agent**: `saat-generate`
**Input**: `requirements.json`

### 3.1 Run Architecture Generation

```
Task tool with:
  subagent_type: saat-generate
  prompt: "Generate C4 architecture model from requirements.json. Design a
          high-performance API gateway using Kong or similar. Include service
          discovery, caching, and observability. Assign criticality CS1 to
          gateway and auth components. Output to architecture.json"
```

### 3.2 Review Generated Architecture

Open `architecture.json`:

**Systems** (1):
- FastGate API Platform (CS1)

**Containers** (7):
1. **API Gateway** (CS1) - Kong Gateway, request routing
2. **Auth Service** (CS1) - Keycloak, OAuth 2.0 provider
3. **Service Registry** (CS2) - Consul, service discovery
4. **Cache Layer** (CS2) - Redis cluster
5. **Config Service** (SL1) - Configuration management
6. **Monitoring Stack** (SL1) - Prometheus + Grafana
7. **Admin Portal** (SL2) - Gateway administration

**Key Design Decisions**:
- Kong Gateway for flexibility and performance
- Redis for response caching and session storage
- Consul for dynamic service discovery
- Multi-AZ deployment for HA

---

## Step 4: Define Characteristics

**File**: `characteristics.json`

### 4.1 Create Characteristics File

```bash
bash scripts/create-characteristics.sh gateway-characteristics.json
```

Answer prompts:
- Project: `FastGate API Gateway`
- Domain: `Enterprise Application`
- Uptime: `99.99%`
- Response time: `10ms`
- Concurrent users: `100000`

### 4.2 Key Characteristics

```json
{
  "characteristics": [
    {
      "name": "Performance",
      "importance": 10,
      "target": "10ms p99 latency",
      "reason": "Gateway overhead must be minimal"
    },
    {
      "name": "Scalability",
      "importance": 10,
      "target": "100,000 requests/second",
      "reason": "Must handle peak traffic without degradation"
    },
    {
      "name": "Availability",
      "importance": 10,
      "target": 99.99,
      "reason": "Gateway is critical path for all services"
    }
  ]
}
```

---

## Step 5: Validate Architecture

**Agent**: `saat-validate`

### 5.1 Run Validation

```
Task tool with:
  subagent_type: saat-validate
  prompt: "Validate architecture.json for best practices. Check for single
          points of failure, proper error handling, monitoring, and security
          controls. Output to validation-report.json"
```

### 5.2 Review Results

**Overall Score**: 92/100 ✅

**Warnings** (3):
1. ⚠️ Cache layer not replicated across AZs
2. ⚠️ No circuit breakers for backend calls
3. ⚠️ Rate limiting configuration incomplete

**Fixes**:
- Enable Redis cluster mode (Multi-AZ)
- Add circuit breakers using Kong plugin
- Define rate limits per service/user tier

---

## Step 6: Analyze Characteristics

**Agent**: `saat-analyze-characteristics`

### 6.1 Run Analysis

```
Task tool with:
  subagent_type: saat-analyze-characteristics
  prompt: "Analyze architecture.json against characteristics.json. Focus on
          performance, scalability, and availability. Provide detailed
          recommendations for optimization. Output to analysis-report.json"
```

### 6.2 Key Findings

**Overall Score**: 88/100 🟢

**Met** (10 characteristics):
- ✅ Performance: 8ms p99 latency (target: 10ms)
- ✅ Scalability: 125K req/sec (target: 100K)
- ✅ Security: OAuth 2.0, mTLS, WAF
- ✅ Maintainability: Well-documented, modular

**Partial** (4 characteristics):
- ⚠️ Availability: 99.98% (target: 99.99%)
- ⚠️ Fault Tolerance: Circuit breakers missing
- ⚠️ Observability: Distributed tracing incomplete
- ⚠️ Cost Optimization: Over-provisioned resources

**Recommendations**:
1. Add circuit breakers (Priority: HIGH)
2. Implement distributed tracing with Jaeger
3. Enable auto-scaling to reduce costs
4. Add chaos engineering tests

---

## Step 7: Security Analysis

**Agent**: `saat-security`

### 7.1 Run Security Audit

```
Task tool with:
  subagent_type: saat-security
  prompt: "Perform security analysis of architecture.json. Focus on API
          security patterns, authentication flows, rate limiting, and DDoS
          protection. Output to security-report.json"
```

### 7.2 Security Score

**Score**: 85/100 🟢

**Strengths**:
- ✅ OAuth 2.0 with JWT validation
- ✅ TLS 1.3 everywhere
- ✅ WAF with OWASP rules
- ✅ Rate limiting per user
- ✅ API key rotation

**High Priority Issues** (2):
1. 🟠 No DDoS protection at network layer
   - **Fix**: Enable AWS Shield or GCP Cloud Armor
   - **Effort**: 1 day

2. 🟠 Insufficient rate limiting for anonymous users
   - **Fix**: Add stricter limits (100 req/min for unauthenticated)
   - **Effort**: 2 hours

**Medium Priority** (3):
- Implement request signing for sensitive APIs
- Add API analytics for anomaly detection
- Enable bot detection (Cloudflare/Akamai)

---

## Step 8: Generate Documentation

**Agent**: `saat-document`

### 8.1 Run Documentation Generation

```
Task tool with:
  subagent_type: saat-document
  prompt: "Generate comprehensive documentation from architecture.json. Include
          API gateway design, authentication flows, rate limiting strategy,
          monitoring guide, and runbooks. Output to docs/ directory"
```

### 8.2 Generated Docs

```
docs/
├── api-gateway-design.md
├── authentication-flow.md
├── rate-limiting-strategy.md
├── monitoring-guide.md
├── runbooks/
│   ├── incident-response.md
│   ├── scaling-procedures.md
│   └── disaster-recovery.md
└── ADRs/
    ├── 001-kong-gateway-choice.md
    ├── 002-oauth2-authentication.md
    └── 003-multi-region-deployment.md
```

---

## Step 9: Generate Infrastructure

**Agent**: `saat-terraform`

### 9.1 Multi-Cloud Deployment

For this gateway, we'll deploy to both AWS and GCP:

#### AWS Deployment

```
Task tool with:
  subagent_type: saat-terraform
  prompt: "Generate Terraform for architecture.json on AWS. Use EKS for
          compute, RDS for Postgres, ElastiCache for Redis. Include ALB, WAF,
          and CloudWatch. Output to terraform/aws/"
```

#### GCP Deployment

```
Task tool with:
  subagent_type: saat-terraform
  prompt: "Generate Terraform for architecture.json on GCP. Use GKE for
          compute, Cloud SQL for Postgres, Memorystore for Redis. Include
          Global LB, Cloud Armor, and Cloud Monitoring. Output to terraform/gcp/"
```

### 9.2 Deploy to AWS

```bash
cd terraform/aws/
terraform init
terraform plan -var="environment=staging"
terraform apply
```

**Resources Created**: ~120
**Cost**: $3,030/month

### 9.3 Deploy to GCP

```bash
cd terraform/gcp/
terraform init
terraform plan -var="environment=staging"
terraform apply
```

**Resources Created**: ~110
**Cost**: $3,170/month

---

## Step 10: Performance Testing

### 10.1 Load Test with k6

Create `load-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 10000 },  // Ramp to 10K users
    { duration: '5m', target: 10000 },  // Stay at 10K
    { duration: '2m', target: 50000 },  // Spike to 50K
    { duration: '5m', target: 50000 },  // Stay at 50K
    { duration: '2m', target: 0 },      // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<10'], // 99% under 10ms
    http_req_failed: ['rate<0.01'],  // Less than 1% errors
  },
};

export default function () {
  const res = http.get('https://api.fastgate.com/v1/products');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 10ms': (r) => r.timings.duration < 10,
  });
  sleep(1);
}
```

Run test:
```bash
k6 run --out influxdb=http://localhost:8086 load-test.js
```

### 10.2 Expected Results

```
✓ http_req_duration..........: avg=8.2ms   min=2.1ms  p(99)=9.8ms  max=45ms
✓ http_req_failed............: 0.08%       (800 of 1M requests)
✓ http_reqs..................: 1,000,000   166,666 req/sec
✓ iteration_duration.........: avg=1.01s

PASS: All thresholds met ✅
```

---

## Step 11: Deploy to Production

### 11.1 Pre-Production Checklist

- [x] Load testing passed
- [x] Security audit complete
- [x] Disaster recovery tested
- [x] Runbooks documented
- [x] Team trained
- [x] Monitoring dashboards created
- [x] Alerting configured
- [x] Blue-green deployment ready

### 11.2 Blue-Green Deployment

```bash
# Deploy green environment
terraform apply -var="environment=prod-green"

# Smoke tests on green
curl https://api-green.fastgate.com/health

# Switch traffic: 10% -> 50% -> 100%
kubectl patch ingress api-gateway -p '{"spec":{"rules":[{"host":"api.fastgate.com","http":{"paths":[{"path":"/","backend":{"serviceName":"gateway-green","servicePort":8000}}]}}]}}'

# Monitor for 1 hour
# If issues: rollback to blue
# If success: decommission blue
```

---

## 🎓 What You Learned

Greenfield architecture skills:

1. ✅ Extract structured requirements with `saat-requirements`
2. ✅ Design high-performance systems (<10ms latency)
3. ✅ Multi-cloud deployment (AWS + GCP)
4. ✅ API security patterns (OAuth, rate limiting)
5. ✅ Load testing with k6
6. ✅ Blue-green deployment strategy
7. ✅ Performance optimization techniques

---

## 🚀 Next Steps

### Immediate

1. **Implement missing features**:
   - Circuit breakers
   - Distributed tracing
   - DDoS protection

2. **Optimize performance**:
   - Fine-tune cache TTLs
   - Optimize Kong plugins
   - Database connection pooling

### Long-term

3. **Add advanced features**:
   - GraphQL gateway
   - WebSocket support
   - Request/response transformation
   - API versioning

4. **Operational excellence**:
   - Automated chaos engineering
   - Canary deployments
   - Multi-region failover testing

---

## 📚 Compare Workflows

| Aspect | Brownfield (E-commerce) | Greenfield (Gateway) |
|--------|-------------------------|----------------------|
| Starting point | Existing codebase | Requirements doc |
| First agent | `saat-discover` | `saat-requirements` |
| Challenge | Legacy constraints | Blank slate decisions |
| Timeline | 12 months (migration) | 3 months (net new) |
| Risk | Breaking existing features | Untested architecture |

---

**Congratulations!** 🎉

You've built a production-ready API gateway from scratch using SAAT greenfield workflow!

**Next**: Try the [Healthcare Portal](../healthcare-portal/README.md) walkthrough (HIPAA compliance focus)!
