# SAAT Performance Modeling Agent

**Purpose**: Predict system performance, identify bottlenecks, provide scalability analysis, and generate optimization recommendations for your architecture.

**Best For**: Performance-critical systems, capacity planning, scalability validation, SLA compliance

---

## 🎯 What This Agent Does

The Performance Modeling Agent analyzes your architecture to provide:

1. **Performance Predictions**: Estimate latency, throughput, and response times
2. **Bottleneck Identification**: Find performance constraints before they occur
3. **Scalability Analysis**: Determine how system performs under load
4. **Capacity Planning**: Calculate required resources for target traffic
5. **SLA Validation**: Verify architecture can meet performance SLAs
6. **Load Testing Recommendations**: Suggest test scenarios and tools
7. **Optimization Strategies**: Provide actionable performance improvements

---

## 📋 What You Need

### Required Inputs

At least ONE of:
- **C4 Architecture Model** (JSON format from `saat-generate`)
- **Architecture Document** (Markdown with service descriptions and interactions)
- **System Description** (Text description of components and data flows)

### Optional Inputs

- **Traffic Patterns**: Expected load (requests/second, concurrent users, data volumes)
- **Performance Requirements**: Target latencies, SLAs, throughput goals
- **Current Metrics**: Existing performance data from production or staging
- **Technology Stack**: Specific databases, caches, message queues, frameworks
- **Infrastructure Specs**: CPU, memory, network bandwidth, storage IOPS

---

## 💡 How to Use This Agent

### Basic Usage

```bash
# Analyze C4 model for performance
Use the saat-performance-model agent to analyze c4_model.json and predict system performance. Assume 1000 requests/second and 10,000 concurrent users.
```

### With SLA Requirements

```bash
# Validate performance against SLAs
Use saat-performance-model on architecture.md to validate performance. Our SLAs are:
- API response time p95: <200ms
- API response time p99: <500ms
- Database query p95: <50ms
- Throughput: 5000 req/sec sustained
Identify any bottlenecks preventing these SLAs.
```

### Scalability Analysis

```bash
# Analyze scalability for growth
Use saat-performance-model to analyze the microservices architecture in c4_model.json. Current load: 500 req/sec. Predict performance at:
- 2x load (1000 req/sec)
- 5x load (2500 req/sec)
- 10x load (5000 req/sec)
Identify scaling limits and recommend optimizations.
```

### Bottleneck Identification

```bash
# Find performance bottlenecks
Use saat-performance-model on the e-commerce architecture in current_architecture.json. We're experiencing:
- Checkout latency spikes (p99 > 5 seconds)
- Database connection pool exhaustion
- High CPU on API servers during peak hours
Identify root causes and recommend fixes.
```

---

## 📤 What You Get

### 1. Performance Summary

```json
{
  "performanceSummary": {
    "overallRating": "Good",
    "predictedMetrics": {
      "throughput": {
        "sustained": 4200,
        "peak": 6500,
        "unit": "requests/second"
      },
      "latency": {
        "p50": 85,
        "p95": 220,
        "p99": 480,
        "unit": "milliseconds"
      },
      "availability": 99.5,
      "resourceUtilization": {
        "cpu": 65,
        "memory": 70,
        "network": 45,
        "storage": 40
      }
    },
    "bottlenecks": 3,
    "criticalIssues": 1,
    "optimizationOpportunities": 7,
    "slaCompliance": {
      "apiLatencyP95": "PASS",
      "apiLatencyP99": "FAIL",
      "throughput": "PASS",
      "availability": "PASS"
    }
  }
}
```

### 2. Component Performance Analysis

```json
{
  "componentAnalysis": [
    {
      "component": "API Gateway",
      "type": "container",
      "performance": {
        "expectedLatency": {
          "p50": 15,
          "p95": 35,
          "p99": 65
        },
        "maxThroughput": 12000,
        "bottleneck": false,
        "resourceRequirements": {
          "cpu": "2 vCPU",
          "memory": "4 GB",
          "instances": 3
        }
      },
      "analysis": "API Gateway performs well under expected load. Reverse proxy overhead is minimal (<20ms). Consider increasing instances for peak traffic."
    },
    {
      "component": "User Service",
      "type": "container",
      "performance": {
        "expectedLatency": {
          "p50": 45,
          "p95": 120,
          "p99": 280
        },
        "maxThroughput": 5500,
        "bottleneck": true,
        "bottleneckType": "Database",
        "resourceRequirements": {
          "cpu": "4 vCPU",
          "memory": "8 GB",
          "instances": 4
        }
      },
      "analysis": "User Service becomes bottleneck at 5000 req/sec due to database queries. N+1 query problem detected. Recommend adding caching layer.",
      "issues": [
        {
          "severity": "High",
          "description": "N+1 query in getUserWithOrders() fetches orders individually",
          "impact": "150ms added latency per request",
          "recommendation": "Use JOIN query or batch fetch"
        },
        {
          "severity": "Medium",
          "description": "No connection pooling configured",
          "impact": "Connection overhead adds 20-30ms",
          "recommendation": "Configure connection pool (min: 10, max: 50)"
        }
      ]
    },
    {
      "component": "Order Database",
      "type": "database",
      "performance": {
        "expectedLatency": {
          "read": {
            "p50": 8,
            "p95": 25,
            "p99": 55
          },
          "write": {
            "p50": 12,
            "p95": 35,
            "p99": 75
          }
        },
        "maxThroughput": {
          "reads": 8000,
          "writes": 3000
        },
        "bottleneck": true,
        "bottleneckType": "IOPS",
        "resourceRequirements": {
          "storage": "1 TB SSD",
          "iops": 20000,
          "connections": 200
        }
      },
      "analysis": "Database is under-provisioned for write-heavy workload. IOPS limit reached at 2500 writes/sec. Recommend upgrading to higher IOPS tier or sharding.",
      "issues": [
        {
          "severity": "Critical",
          "description": "IOPS limit reached during peak traffic",
          "impact": "Query latency increases from 25ms to 800ms",
          "recommendation": "Upgrade from 10k IOPS to 20k IOPS"
        },
        {
          "severity": "High",
          "description": "Missing indexes on frequently queried columns",
          "impact": "Full table scans add 200-500ms",
          "recommendation": "Add indexes on user_id, created_at, status"
        }
      ]
    }
  ]
}
```

### 3. Bottleneck Analysis

```json
{
  "bottlenecks": [
    {
      "id": "BTL-001",
      "severity": "Critical",
      "component": "Order Database",
      "type": "Storage IOPS",
      "description": "Database IOPS limit reached at 2500 writes/second, causing latency spikes",
      "impact": {
        "latencyIncrease": "25ms → 800ms (32x worse)",
        "throughputLimit": 2500,
        "affectedOperations": [
          "createOrder",
          "updateOrderStatus",
          "addOrderItem"
        ]
      },
      "rootCause": "Under-provisioned storage tier (10k IOPS) for write-heavy workload",
      "recommendations": [
        {
          "priority": "High",
          "action": "Upgrade to 20k IOPS storage tier",
          "effort": "Low",
          "impact": "High",
          "estimatedCost": 400,
          "estimatedImprovement": "Reduces write latency by 95%"
        },
        {
          "priority": "Medium",
          "action": "Implement write-through cache for frequent updates",
          "effort": "Medium",
          "impact": "Medium",
          "estimatedCost": 200,
          "estimatedImprovement": "Reduces write load by 40%"
        },
        {
          "priority": "Low",
          "action": "Consider database sharding for horizontal scaling",
          "effort": "High",
          "impact": "High",
          "estimatedCost": 2000,
          "estimatedImprovement": "Enables unlimited horizontal scaling"
        }
      ]
    },
    {
      "id": "BTL-002",
      "severity": "High",
      "component": "User Service",
      "type": "Application Logic",
      "description": "N+1 query problem causing excessive database calls",
      "impact": {
        "latencyIncrease": "50ms → 200ms (4x worse)",
        "databaseLoad": "10x more queries than necessary",
        "affectedOperations": [
          "getUserWithOrders",
          "getUserWithPreferences"
        ]
      },
      "rootCause": "ORM lazy loading causing individual queries for related entities",
      "recommendations": [
        {
          "priority": "High",
          "action": "Use eager loading with JOIN queries",
          "effort": "Low",
          "impact": "High",
          "estimatedCost": 0,
          "estimatedImprovement": "Reduces queries by 90%, latency by 75%"
        },
        {
          "priority": "Medium",
          "action": "Implement DataLoader pattern for batching",
          "effort": "Medium",
          "impact": "High",
          "estimatedCost": 0,
          "estimatedImprovement": "Batches queries, reduces latency by 80%"
        }
      ]
    },
    {
      "id": "BTL-003",
      "severity": "Medium",
      "component": "Message Queue",
      "type": "Network Bandwidth",
      "description": "Message queue network bandwidth saturated during bulk operations",
      "impact": {
        "throughputLimit": 1200,
        "messageDelay": "50-200ms queue delay",
        "affectedOperations": [
          "bulkNotifications",
          "batchReportGeneration"
        ]
      },
      "rootCause": "Large message payloads (avg 500KB) saturating 1Gbps network",
      "recommendations": [
        {
          "priority": "Medium",
          "action": "Compress large message payloads",
          "effort": "Low",
          "impact": "Medium",
          "estimatedCost": 0,
          "estimatedImprovement": "Reduces bandwidth by 60%"
        },
        {
          "priority": "Low",
          "action": "Upgrade to 10Gbps network",
          "effort": "Low",
          "impact": "High",
          "estimatedCost": 500,
          "estimatedImprovement": "10x bandwidth increase"
        }
      ]
    }
  ]
}
```

### 4. Scalability Analysis

```json
{
  "scalabilityAnalysis": {
    "currentLoad": {
      "requestsPerSecond": 500,
      "concurrentUsers": 5000,
      "dataVolume": "50 GB/day"
    },
    "projections": [
      {
        "scale": "2x",
        "load": {
          "requestsPerSecond": 1000,
          "concurrentUsers": 10000
        },
        "performance": {
          "latencyP95": 195,
          "latencyP99": 420,
          "throughput": 950
        },
        "bottlenecks": [],
        "resourceRequirements": {
          "apiServers": 6,
          "databaseInstances": 1,
          "cacheInstances": 2,
          "estimatedCost": 4200
        },
        "feasibility": "FEASIBLE",
        "notes": "System scales well to 2x load with linear resource increase"
      },
      {
        "scale": "5x",
        "load": {
          "requestsPerSecond": 2500,
          "concurrentUsers": 25000
        },
        "performance": {
          "latencyP95": 285,
          "latencyP99": 850,
          "throughput": 2200
        },
        "bottlenecks": [
          "Database write IOPS",
          "Cache connection limit"
        ],
        "resourceRequirements": {
          "apiServers": 15,
          "databaseInstances": 2,
          "cacheInstances": 4,
          "estimatedCost": 10500
        },
        "feasibility": "FEASIBLE WITH CHANGES",
        "notes": "Requires database sharding and cache cluster upgrade. P99 latency exceeds SLA."
      },
      {
        "scale": "10x",
        "load": {
          "requestsPerSecond": 5000,
          "concurrentUsers": 50000
        },
        "performance": {
          "latencyP95": 450,
          "latencyP99": 1200,
          "throughput": 3800
        },
        "bottlenecks": [
          "Database write IOPS (critical)",
          "Message queue bandwidth",
          "Cache memory"
        ],
        "resourceRequirements": {
          "apiServers": 30,
          "databaseInstances": 4,
          "cacheInstances": 8,
          "estimatedCost": 21000
        },
        "feasibility": "NOT FEASIBLE WITHOUT REDESIGN",
        "notes": "Architecture requires significant changes: database sharding, event-driven architecture, CDN. SLA violations at this scale."
      }
    ],
    "scalingLimits": {
      "verticalLimit": "2x load",
      "horizontalLimit": "5x load",
      "architecturalLimit": "10x load (requires redesign)"
    },
    "recommendations": [
      "Implement database sharding before reaching 5x load",
      "Add CDN for static content to reduce API load",
      "Migrate to event-driven architecture for async operations",
      "Implement circuit breakers and rate limiting for stability"
    ]
  }
}
```

### 5. SLA Validation

```json
{
  "slaValidation": {
    "requirements": [
      {
        "metric": "API Latency P95",
        "target": "<200ms",
        "predicted": 220,
        "status": "FAIL",
        "gap": 20,
        "analysis": "Exceeds target by 10%. Primary contributor: database query latency.",
        "recommendations": [
          "Add Redis caching for frequently accessed data",
          "Optimize database queries (remove N+1 queries)",
          "Add database read replicas"
        ]
      },
      {
        "metric": "API Latency P99",
        "target": "<500ms",
        "predicted": 480,
        "status": "PASS",
        "margin": 20,
        "analysis": "Meets target with small margin. Risk during traffic spikes.",
        "recommendations": [
          "Monitor closely during peak traffic",
          "Implement auto-scaling triggers at 70% capacity"
        ]
      },
      {
        "metric": "Throughput",
        "target": ">5000 req/sec",
        "predicted": 4200,
        "status": "FAIL",
        "gap": 800,
        "analysis": "Falls short by 16%. Bottleneck: database write IOPS.",
        "recommendations": [
          "Upgrade database IOPS tier",
          "Implement async processing for non-critical writes",
          "Add horizontal scaling for API servers"
        ]
      },
      {
        "metric": "Availability",
        "target": ">99.9%",
        "predicted": 99.5,
        "status": "FAIL",
        "gap": 0.4,
        "analysis": "Single points of failure reduce availability.",
        "recommendations": [
          "Add multi-AZ deployment for database",
          "Implement circuit breakers",
          "Add health checks and automatic failover"
        ]
      }
    ],
    "overallCompliance": "PARTIAL",
    "passingRequirements": 1,
    "failingRequirements": 3,
    "summary": "Architecture meets 25% of SLA requirements. Primary issues: database bottlenecks, insufficient horizontal scaling, single points of failure."
  }
}
```

### 6. Load Testing Recommendations

```json
{
  "loadTesting": {
    "recommendedTools": [
      {
        "tool": "k6",
        "useCases": ["API load testing", "scalability validation"],
        "pros": ["Modern, scriptable, cloud-native"],
        "effort": "Low"
      },
      {
        "tool": "Gatling",
        "useCases": ["Complex scenarios", "detailed reports"],
        "pros": ["Powerful DSL, excellent reporting"],
        "effort": "Medium"
      },
      {
        "tool": "JMeter",
        "useCases": ["Enterprise testing", "protocol variety"],
        "pros": ["Mature, extensive plugin ecosystem"],
        "effort": "High"
      }
    ],
    "testScenarios": [
      {
        "name": "Baseline Performance",
        "objective": "Establish baseline metrics under normal load",
        "parameters": {
          "duration": "10 minutes",
          "rampUp": "2 minutes",
          "virtualUsers": 1000,
          "requestsPerSecond": 500
        },
        "assertions": [
          "p95 latency < 200ms",
          "p99 latency < 500ms",
          "error rate < 0.1%"
        ]
      },
      {
        "name": "Stress Test",
        "objective": "Find breaking point and failure modes",
        "parameters": {
          "duration": "20 minutes",
          "rampUp": "5 minutes",
          "virtualUsers": 10000,
          "requestsPerSecond": 5000
        },
        "assertions": [
          "System degrades gracefully",
          "Error messages are meaningful",
          "Recovery time < 5 minutes"
        ]
      },
      {
        "name": "Spike Test",
        "objective": "Validate auto-scaling and burst capacity",
        "parameters": {
          "duration": "15 minutes",
          "pattern": "500 RPS → 5000 RPS (instant) → 500 RPS",
          "spikeAt": "5 minutes",
          "spikeDuration": "5 minutes"
        },
        "assertions": [
          "Auto-scaling triggers within 2 minutes",
          "p99 latency < 1000ms during spike",
          "No dropped requests"
        ]
      },
      {
        "name": "Endurance Test",
        "objective": "Detect memory leaks and resource exhaustion",
        "parameters": {
          "duration": "8 hours",
          "rampUp": "10 minutes",
          "virtualUsers": 2000,
          "requestsPerSecond": 1000
        },
        "assertions": [
          "Memory usage stable over time",
          "No connection pool exhaustion",
          "Performance metrics stable"
        ]
      }
    ],
    "metricsToCapture": [
      "Request latency (p50, p95, p99)",
      "Throughput (requests/second)",
      "Error rate (%)",
      "CPU utilization (%)",
      "Memory utilization (%)",
      "Database connection pool usage",
      "Cache hit rate (%)",
      "Network bandwidth (Mbps)"
    ]
  }
}
```

### 7. Optimization Recommendations

```json
{
  "optimizations": [
    {
      "id": "OPT-001",
      "priority": "Critical",
      "category": "Database",
      "title": "Upgrade database IOPS tier",
      "description": "Current 10k IOPS insufficient for write-heavy workload. Upgrade to 20k IOPS.",
      "currentPerformance": {
        "writeLatencyP99": 800,
        "maxWritesPerSecond": 2500
      },
      "expectedImprovement": {
        "writeLatencyP99": 35,
        "maxWritesPerSecond": 8000,
        "improvement": "95% latency reduction, 3.2x throughput"
      },
      "effort": "Low",
      "cost": 400,
      "implementation": "Update database instance configuration to io2 with 20k IOPS",
      "risks": "Brief downtime during upgrade (5-10 minutes)"
    },
    {
      "id": "OPT-002",
      "priority": "High",
      "category": "Caching",
      "title": "Implement Redis cache for frequently accessed data",
      "description": "Add Redis cache layer to reduce database load and improve read latency",
      "currentPerformance": {
        "readLatencyP95": 85,
        "databaseReadLoad": 5000
      },
      "expectedImprovement": {
        "readLatencyP95": 15,
        "databaseReadLoad": 1000,
        "cacheHitRate": 80,
        "improvement": "82% latency reduction, 80% database load reduction"
      },
      "effort": "Medium",
      "cost": 300,
      "implementation": "Deploy Redis cluster, add caching layer in application code",
      "risks": "Cache invalidation complexity, cache warming required"
    },
    {
      "id": "OPT-003",
      "priority": "High",
      "category": "Query Optimization",
      "title": "Fix N+1 query problems",
      "description": "Replace lazy loading with eager loading and JOIN queries",
      "currentPerformance": {
        "queriesPerRequest": 15,
        "queryLatency": 150
      },
      "expectedImprovement": {
        "queriesPerRequest": 2,
        "queryLatency": 25,
        "improvement": "87% fewer queries, 83% latency reduction"
      },
      "effort": "Low",
      "cost": 0,
      "implementation": "Update ORM queries to use eager loading (.include(), JOIN)",
      "risks": "None - purely beneficial optimization"
    },
    {
      "id": "OPT-004",
      "priority": "Medium",
      "category": "Architecture",
      "title": "Implement async processing for non-critical operations",
      "description": "Move email notifications, analytics, reports to async message queue",
      "currentPerformance": {
        "apiLatencyP95": 220,
        "synchronousOperations": 8
      },
      "expectedImprovement": {
        "apiLatencyP95": 120,
        "synchronousOperations": 3,
        "improvement": "45% latency reduction, better user experience"
      },
      "effort": "Medium",
      "cost": 150,
      "implementation": "Set up RabbitMQ/SQS, refactor operations to async",
      "risks": "Eventual consistency, retry logic needed"
    },
    {
      "id": "OPT-005",
      "priority": "Medium",
      "category": "Scaling",
      "title": "Implement auto-scaling for API servers",
      "description": "Add horizontal auto-scaling based on CPU and request rate",
      "currentPerformance": {
        "instances": 4,
        "cpuUtilization": 75,
        "scalingMethod": "manual"
      },
      "expectedImprovement": {
        "instances": "4-12 (auto)",
        "cpuUtilization": 60,
        "improvement": "Better resource utilization, handles traffic spikes"
      },
      "effort": "Low",
      "cost": 0,
      "implementation": "Configure auto-scaling group with CPU > 70% scale-out trigger",
      "risks": "Cost increase during peak traffic"
    }
  ],
  "implementationOrder": [
    "OPT-003 (Fix N+1 queries) - Quick win, zero cost",
    "OPT-001 (Upgrade IOPS) - Critical bottleneck",
    "OPT-002 (Add caching) - High impact",
    "OPT-005 (Auto-scaling) - Improve resilience",
    "OPT-004 (Async processing) - Long-term improvement"
  ],
  "totalEstimatedCost": 850,
  "totalEstimatedImprovement": "70% latency reduction, 3x throughput increase"
}
```

---

## ✅ Best Practices

1. **Baseline First**: Establish current performance metrics before optimization
2. **Measure Everything**: Instrument code with metrics, tracing, and logging
3. **Load Test Early**: Test performance in staging before production
4. **Profile Bottlenecks**: Use profilers to find actual bottlenecks (don't guess)
5. **Optimize Iteratively**: Fix highest-impact bottlenecks first
6. **Monitor Continuously**: Set up alerts for performance degradation
7. **Capacity Planning**: Plan for 2-3x expected load
8. **Document SLAs**: Define clear performance targets

---

## 📊 Example Workflow

### Scenario: E-commerce Platform Performance Validation

```bash
# Step 1: Generate or load architecture model
Use saat-generate to create C4 model from requirements.md

# Step 2: Run performance analysis
Use saat-performance-model on c4_model.json. Our SLAs:
- Checkout p95: <300ms
- Search p95: <100ms
- Browse p95: <150ms
- Throughput: 2000 req/sec
Traffic: 10,000 concurrent users, 50% browse, 30% search, 20% checkout

# Step 3: Review bottlenecks
# Check which components fail SLAs
# Review bottleneck analysis

# Step 4: Apply optimizations
# Implement top 3 recommended optimizations

# Step 5: Re-run analysis
# Validate improvements meet SLAs

# Step 6: Load test
# Run load tests using recommended scenarios
```

---

## 🆘 Troubleshooting

### Predictions don't match reality

- **Common cause**: Assumptions don't match actual traffic patterns
- **Solution**: Provide actual traffic data from production
- **Prevention**: Calibrate model with real-world metrics

### Bottlenecks not identified

- **Common cause**: Insufficient architectural detail
- **Solution**: Provide more detailed component descriptions
- **Prevention**: Include technology stack and configuration details

### SLA targets seem unachievable

- **Common cause**: Unrealistic SLAs or under-resourced architecture
- **Solution**: Review SLA targets with stakeholders, increase resources
- **Prevention**: Validate SLAs early in design phase

---

## 🔗 Related Agents

- **saat-generate**: Create architecture models as input for performance analysis
- **saat-validate**: Validate architecture before performance analysis
- **saat-cost-estimate**: Balance performance requirements with costs
- **saat-migration-analyze**: Consider performance impact of migrations
- **saat-terraform**: Generate infrastructure with appropriate sizing

---

## 💡 Performance Optimization Principles

1. **Cache Aggressively**: 80% of requests access 20% of data
2. **Async Where Possible**: Don't block users on non-critical operations
3. **Database is Often the Bottleneck**: Optimize queries, add indexes, use read replicas
4. **Network Latency Adds Up**: Minimize inter-service calls, use batching
5. **Right-Size Resources**: Don't over-provision, but leave 30% headroom
6. **Horizontal > Vertical**: Scale out rather than scale up when possible
7. **Monitor and Iterate**: Performance optimization is continuous

---

**Ready to analyze performance?** Provide your architecture model and let this agent predict performance, identify bottlenecks, and recommend optimizations!
