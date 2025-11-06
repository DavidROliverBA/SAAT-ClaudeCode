# SAAT Dependency Analysis Agent

**Purpose**: Analyze project dependencies, identify vulnerabilities (CVEs), detect circular dependencies, check license compliance, and recommend updates.

**Best For**: Security audits, dependency management, vulnerability scanning, license compliance, technical debt assessment

---

## 🎯 What This Agent Does

The Dependency Analysis Agent examines your project's dependencies to provide:

1. **Dependency Graph**: Visualize direct and transitive dependencies
2. **Vulnerability Scanning**: Identify CVEs with severity ratings and remediation
3. **Circular Dependency Detection**: Find and break dependency cycles
4. **License Compliance**: Check for incompatible or risky licenses
5. **Outdated Package Alerts**: Identify packages with available updates
6. **Upgrade Impact Analysis**: Assess risk of upgrading dependencies
7. **Dependency Health Metrics**: Evaluate dependency quality and maintenance

---

## 📋 What You Need

### Required Inputs

At least ONE of:
- **Package Manifest Files**: `package.json`, `requirements.txt`, `pom.xml`, `go.mod`, `Cargo.toml`, `Gemfile`, `composer.json`
- **Lock Files**: `package-lock.json`, `yarn.lock`, `Pipfile.lock`, `pom.xml`, `go.sum`, `Cargo.lock`
- **Project Directory**: Path to codebase for auto-detection

### Optional Inputs

- **Vulnerability Threshold**: Severity level to report (critical, high, medium, low)
- **License Allowlist**: Approved licenses for your organization
- **Update Policy**: Conservative vs aggressive update strategy
- **Compliance Framework**: GDPR, HIPAA, SOC2 requirements

---

## 💡 How to Use This Agent

### Basic Usage

```bash
# Analyze Node.js project dependencies
Use the saat-dependencies agent to analyze dependencies in /path/to/project (Node.js). Check for vulnerabilities and outdated packages.
```

### Vulnerability Focus

```bash
# Security-focused analysis
Use saat-dependencies on the project at /path/to/project. Focus on:
- Critical and High severity CVEs
- Packages with known exploits
- Dependencies with no recent updates
- Transitive dependencies with vulnerabilities
```

### License Compliance

```bash
# License compliance check
Use saat-dependencies to scan /path/to/project for license compliance. Our policy:
- Approved licenses: MIT, Apache-2.0, BSD-3-Clause
- Prohibited licenses: GPL, AGPL, SSPL
- Flag any unknown or restrictive licenses
```

### Multi-Language Project

```bash
# Analyze polyglot project
Use saat-dependencies on /path/to/project which contains:
- Frontend: Node.js (package.json)
- Backend: Python (requirements.txt)
- Services: Go (go.mod)
Check all for vulnerabilities and circular dependencies.
```

---

## 📤 What You Get

### 1. Dependency Summary

```json
{
  "summary": {
    "totalDependencies": 342,
    "direct": 28,
    "transitive": 314,
    "devDependencies": 45,
    "languages": ["JavaScript", "Python"],
    "vulnerabilities": {
      "critical": 2,
      "high": 7,
      "medium": 15,
      "low": 23,
      "total": 47
    },
    "outdated": 18,
    "licenseIssues": 3,
    "circularDependencies": 1,
    "healthScore": 62,
    "overallRisk": "Medium"
  }
}
```

### 2. Dependency Graph

```json
{
  "dependencyGraph": {
    "format": "tree",
    "dependencies": [
      {
        "name": "express",
        "version": "4.18.2",
        "type": "direct",
        "license": "MIT",
        "dependencies": [
          {
            "name": "body-parser",
            "version": "1.20.1",
            "type": "transitive",
            "license": "MIT",
            "dependencies": [
              {
                "name": "debug",
                "version": "2.6.9",
                "type": "transitive",
                "license": "MIT",
                "vulnerabilities": [
                  {
                    "cve": "CVE-2017-16137",
                    "severity": "Medium"
                  }
                ]
              }
            ]
          },
          {
            "name": "cookie",
            "version": "0.5.0",
            "type": "transitive",
            "license": "MIT"
          }
        ]
      },
      {
        "name": "axios",
        "version": "0.21.1",
        "type": "direct",
        "license": "MIT",
        "vulnerabilities": [
          {
            "cve": "CVE-2021-3749",
            "severity": "High"
          }
        ]
      }
    ]
  }
}
```

### 3. Vulnerability Report

```json
{
  "vulnerabilities": [
    {
      "id": "CVE-2021-3749",
      "severity": "High",
      "cvssScore": 7.5,
      "package": "axios",
      "currentVersion": "0.21.1",
      "fixedVersion": "0.21.2",
      "type": "direct",
      "description": "axios is vulnerable to Inefficient Regular Expression Complexity leading to ReDoS",
      "exploitability": "High",
      "publicExploit": true,
      "impact": {
        "confidentiality": "None",
        "integrity": "None",
        "availability": "High"
      },
      "affectedEndpoints": [
        "API Gateway (/api/*)",
        "User Service"
      ],
      "recommendations": [
        {
          "action": "Upgrade to axios@0.21.2 or higher",
          "priority": "High",
          "effort": "Low",
          "breakingChanges": false
        },
        {
          "action": "Implement input validation and rate limiting",
          "priority": "Medium",
          "effort": "Medium",
          "breakingChanges": false
        }
      ],
      "references": [
        "https://nvd.nist.gov/vuln/detail/CVE-2021-3749",
        "https://github.com/axios/axios/issues/3250"
      ]
    },
    {
      "id": "CVE-2022-24434",
      "severity": "Critical",
      "cvssScore": 9.8,
      "package": "jsonwebtoken",
      "currentVersion": "8.5.1",
      "fixedVersion": "9.0.0",
      "type": "direct",
      "description": "jsonwebtoken vulnerable to signature verification bypass due to algorithm confusion",
      "exploitability": "High",
      "publicExploit": true,
      "impact": {
        "confidentiality": "High",
        "integrity": "High",
        "availability": "High"
      },
      "affectedEndpoints": [
        "Authentication Service (/auth/*)",
        "API Gateway"
      ],
      "recommendations": [
        {
          "action": "URGENT: Upgrade to jsonwebtoken@9.0.0 immediately",
          "priority": "Critical",
          "effort": "Low",
          "breakingChanges": true,
          "notes": "Breaking changes in API algorithm specification"
        },
        {
          "action": "Review all JWT implementations for algorithm confusion",
          "priority": "Critical",
          "effort": "Medium",
          "breakingChanges": false
        },
        {
          "action": "Implement strict algorithm allowlist in verification",
          "priority": "High",
          "effort": "Low",
          "breakingChanges": false
        }
      ],
      "references": [
        "https://nvd.nist.gov/vuln/detail/CVE-2022-24434",
        "https://github.com/auth0/node-jsonwebtoken/security/advisories/GHSA-8cf7-32gw-wr33"
      ]
    },
    {
      "id": "CVE-2021-23362",
      "severity": "Medium",
      "cvssScore": 5.3,
      "package": "postcss",
      "currentVersion": "7.0.35",
      "fixedVersion": "8.2.13",
      "type": "transitive",
      "transitiveFrom": "react-scripts",
      "description": "postcss Regular Expression Denial of Service vulnerability",
      "exploitability": "Medium",
      "publicExploit": false,
      "impact": {
        "confidentiality": "None",
        "integrity": "None",
        "availability": "Medium"
      },
      "affectedEndpoints": [
        "Build process only (no runtime impact)"
      ],
      "recommendations": [
        {
          "action": "Upgrade react-scripts to version with fixed postcss",
          "priority": "Medium",
          "effort": "Medium",
          "breakingChanges": true,
          "notes": "May require code changes for React 18"
        },
        {
          "action": "No immediate action needed - build-time only",
          "priority": "Low",
          "effort": "Low",
          "breakingChanges": false
        }
      ],
      "references": [
        "https://nvd.nist.gov/vuln/detail/CVE-2021-23362"
      ]
    }
  ],
  "summary": {
    "totalVulnerabilities": 47,
    "critical": 2,
    "high": 7,
    "medium": 15,
    "low": 23,
    "fixable": 35,
    "requiresManualReview": 12
  }
}
```

### 4. Circular Dependencies

```json
{
  "circularDependencies": [
    {
      "id": "CIRC-001",
      "severity": "High",
      "cycle": [
        "UserService",
        "OrderService",
        "PaymentService",
        "UserService"
      ],
      "description": "Circular dependency between user, order, and payment services creates tight coupling",
      "impact": {
        "buildComplexity": "High",
        "testability": "Reduced",
        "maintainability": "Poor",
        "refactoringDifficulty": "High"
      },
      "rootCause": "UserService needs OrderService to fetch user's orders, OrderService needs PaymentService for payment status, PaymentService needs UserService for user details",
      "recommendations": [
        {
          "strategy": "Extract Shared Interface",
          "description": "Create a shared UserInfo interface that PaymentService can use without depending on full UserService",
          "effort": "Medium",
          "impact": "High",
          "breaksCycle": true
        },
        {
          "strategy": "Dependency Inversion",
          "description": "Have all services depend on abstractions/interfaces rather than concrete implementations",
          "effort": "High",
          "impact": "High",
          "breaksCycle": true
        },
        {
          "strategy": "Event-Driven Architecture",
          "description": "Use events to communicate between services instead of direct calls",
          "effort": "High",
          "impact": "High",
          "breaksCycle": true
        }
      ]
    },
    {
      "id": "CIRC-002",
      "severity": "Medium",
      "cycle": [
        "utils/formatter",
        "utils/validator",
        "utils/formatter"
      ],
      "description": "Utility modules have circular dependency",
      "impact": {
        "buildComplexity": "Medium",
        "testability": "Reduced",
        "maintainability": "Fair"
      },
      "recommendations": [
        {
          "strategy": "Split Utilities",
          "description": "Separate formatter and validator into independent modules",
          "effort": "Low",
          "impact": "Medium",
          "breaksCycle": true
        }
      ]
    }
  ]
}
```

### 5. License Compliance

```json
{
  "licenseCompliance": {
    "policy": {
      "approved": ["MIT", "Apache-2.0", "BSD-3-Clause", "ISC"],
      "prohibited": ["GPL-3.0", "AGPL-3.0", "SSPL"],
      "requiresReview": ["LGPL", "MPL", "EPL"]
    },
    "summary": {
      "compliant": 315,
      "violations": 3,
      "needsReview": 8,
      "unknown": 16
    },
    "violations": [
      {
        "package": "some-gpl-package",
        "version": "2.1.0",
        "license": "GPL-3.0",
        "severity": "High",
        "type": "direct",
        "risk": "Copyleft license may require releasing source code",
        "usedBy": ["API Gateway"],
        "recommendations": [
          {
            "action": "Replace with MIT-licensed alternative",
            "alternative": "alternative-package",
            "effort": "Medium"
          },
          {
            "action": "Seek legal approval if replacing is not feasible",
            "effort": "High"
          }
        ]
      }
    ],
    "needsReview": [
      {
        "package": "lgpl-component",
        "version": "1.5.0",
        "license": "LGPL-2.1",
        "severity": "Medium",
        "type": "transitive",
        "transitiveFrom": "some-library",
        "risk": "Lesser GPL may have linking restrictions",
        "recommendations": [
          {
            "action": "Review LGPL terms with legal team",
            "effort": "Low"
          },
          {
            "action": "Ensure dynamic linking (not static) if using in proprietary software",
            "effort": "Low"
          }
        ]
      }
    ],
    "unknown": [
      {
        "package": "unlicensed-package",
        "version": "0.2.1",
        "license": "UNKNOWN",
        "severity": "High",
        "risk": "No explicit license may default to copyright (all rights reserved)",
        "recommendations": [
          {
            "action": "Contact package maintainer for clarification",
            "effort": "Low"
          },
          {
            "action": "Consider replacing with properly licensed alternative",
            "effort": "Medium"
          }
        ]
      }
    ]
  }
}
```

### 6. Outdated Dependencies

```json
{
  "outdatedDependencies": [
    {
      "package": "react",
      "currentVersion": "17.0.2",
      "latestVersion": "18.2.0",
      "type": "direct",
      "versionsBehind": "1 major",
      "releaseDate": {
        "current": "2021-03-22",
        "latest": "2022-06-14"
      },
      "ageInMonths": 15,
      "updateType": "major",
      "breakingChanges": true,
      "securityImpact": "Low",
      "recommendations": [
        {
          "action": "Upgrade to React 18",
          "priority": "Medium",
          "effort": "High",
          "benefits": [
            "Automatic batching",
            "Concurrent features",
            "Improved SSR"
          ],
          "risks": [
            "Breaking changes in lifecycle methods",
            "Third-party library compatibility",
            "Testing updates required"
          ],
          "estimatedEffort": "40-60 hours",
          "migrationGuide": "https://react.dev/blog/2022/03/08/react-18-upgrade-guide"
        }
      ]
    },
    {
      "package": "lodash",
      "currentVersion": "4.17.19",
      "latestVersion": "4.17.21",
      "type": "direct",
      "versionsBehind": "2 patches",
      "releaseDate": {
        "current": "2020-07-20",
        "latest": "2021-02-20"
      },
      "ageInMonths": 42,
      "updateType": "patch",
      "breakingChanges": false,
      "securityImpact": "High",
      "hasVulnerabilities": true,
      "vulnerabilities": [
        "CVE-2020-28500",
        "CVE-2021-23337"
      ],
      "recommendations": [
        {
          "action": "URGENT: Upgrade to lodash@4.17.21",
          "priority": "Critical",
          "effort": "Low",
          "benefits": [
            "Fixes ReDoS vulnerabilities",
            "No breaking changes"
          ],
          "risks": [],
          "estimatedEffort": "1-2 hours"
        }
      ]
    },
    {
      "package": "typescript",
      "currentVersion": "4.5.2",
      "latestVersion": "5.3.3",
      "type": "dev",
      "versionsBehind": "1 major",
      "releaseDate": {
        "current": "2021-11-23",
        "latest": "2023-11-16"
      },
      "ageInMonths": 24,
      "updateType": "major",
      "breakingChanges": true,
      "securityImpact": "None",
      "recommendations": [
        {
          "action": "Upgrade to TypeScript 5.x",
          "priority": "Medium",
          "effort": "Medium",
          "benefits": [
            "Better type inference",
            "Decorator support",
            "Performance improvements"
          ],
          "risks": [
            "Stricter type checking may reveal existing issues",
            "Build configuration updates"
          ],
          "estimatedEffort": "10-20 hours"
        }
      ]
    }
  ],
  "summary": {
    "totalOutdated": 18,
    "major": 5,
    "minor": 7,
    "patch": 6,
    "withVulnerabilities": 4,
    "criticalUpdates": 2
  }
}
```

### 7. Dependency Health Metrics

```json
{
  "dependencyHealth": [
    {
      "package": "express",
      "version": "4.18.2",
      "healthScore": 95,
      "metrics": {
        "maintenance": {
          "lastPublish": "2023-03-24",
          "releaseFrequency": "Monthly",
          "openIssues": 45,
          "closedIssues": 3250,
          "score": 90
        },
        "popularity": {
          "downloads": 25000000,
          "githubStars": 61000,
          "dependents": 75000,
          "score": 100
        },
        "quality": {
          "hasTests": true,
          "testCoverage": 95,
          "hasDocumentation": true,
          "hasTypeScript": true,
          "score": 95
        },
        "security": {
          "vulnerabilities": 0,
          "lastAudit": "2023-11-01",
          "hasSecurityPolicy": true,
          "score": 100
        }
      },
      "recommendation": "Excellent - Well-maintained, popular, secure package",
      "riskLevel": "Low"
    },
    {
      "package": "some-abandoned-package",
      "version": "1.2.3",
      "healthScore": 35,
      "metrics": {
        "maintenance": {
          "lastPublish": "2019-05-12",
          "releaseFrequency": "None (4+ years)",
          "openIssues": 87,
          "closedIssues": 12,
          "score": 20
        },
        "popularity": {
          "downloads": 5000,
          "githubStars": 150,
          "dependents": 25,
          "score": 30
        },
        "quality": {
          "hasTests": false,
          "testCoverage": 0,
          "hasDocumentation": false,
          "hasTypeScript": false,
          "score": 25
        },
        "security": {
          "vulnerabilities": 3,
          "lastAudit": "Never",
          "hasSecurityPolicy": false,
          "score": 40
        }
      },
      "recommendation": "REPLACE - Package appears abandoned, has vulnerabilities, poor quality",
      "riskLevel": "High",
      "alternatives": [
        {
          "name": "modern-alternative",
          "healthScore": 88,
          "migrationEffort": "Medium"
        }
      ]
    }
  ]
}
```

### 8. Upgrade Impact Analysis

```json
{
  "upgradeImpact": {
    "package": "react",
    "from": "17.0.2",
    "to": "18.2.0",
    "updateType": "major",
    "breakingChanges": [
      {
        "change": "Automatic batching of updates",
        "impact": "Medium",
        "description": "setState calls are now automatically batched in all contexts",
        "requiredAction": "Review components relying on synchronous updates",
        "affectedComponents": ["UserProfile", "OrderForm"],
        "estimatedEffort": "8 hours"
      },
      {
        "change": "New root API",
        "impact": "Low",
        "description": "ReactDOM.render replaced with createRoot",
        "requiredAction": "Update entry point (index.tsx)",
        "affectedComponents": ["index.tsx"],
        "estimatedEffort": "1 hour"
      },
      {
        "change": "Stricter hydration errors",
        "impact": "High",
        "description": "SSR hydration mismatches now throw errors instead of warnings",
        "requiredAction": "Fix all hydration mismatches in SSR pages",
        "affectedComponents": ["HomePage", "ProductPage", "CheckoutPage"],
        "estimatedEffort": "20 hours"
      }
    ],
    "dependencies": {
      "needsUpdate": [
        "react-dom@18.2.0",
        "react-router-dom@6.x",
        "@testing-library/react@13.x"
      ],
      "incompatible": [
        "some-old-package@2.x (no React 18 support)"
      ]
    },
    "testingRequired": [
      "All component tests",
      "SSR hydration tests",
      "State management tests"
    ],
    "estimatedEffort": {
      "development": "40 hours",
      "testing": "20 hours",
      "documentation": "5 hours",
      "total": "65 hours"
    },
    "rollbackPlan": {
      "difficulty": "Low",
      "steps": [
        "Revert package.json changes",
        "npm install",
        "Revert code changes"
      ],
      "estimatedTime": "15 minutes"
    },
    "recommendation": "Proceed with upgrade - Benefits outweigh costs, well-documented migration path"
  }
}
```

---

## ✅ Best Practices

1. **Regular Audits**: Run dependency analysis weekly or with every PR
2. **Automate Scanning**: Integrate into CI/CD pipeline
3. **Prioritize Critical CVEs**: Fix critical and high vulnerabilities immediately
4. **Keep Dependencies Updated**: Update patch versions weekly, minors monthly, majors quarterly
5. **Use Lock Files**: Always commit `package-lock.json`, `yarn.lock`, etc.
6. **Review Licenses**: Check licenses before adding new dependencies
7. **Limit Dependencies**: Fewer dependencies = smaller attack surface
8. **Monitor Health**: Avoid abandoned or poorly maintained packages

---

## 📊 Example Workflow

### Scenario: Security Audit Before Production Release

```bash
# Step 1: Run dependency analysis
Use saat-dependencies to scan /path/to/project for all issues (vulnerabilities, licenses, outdated packages)

# Step 2: Prioritize fixes
# - Critical/High CVEs: Fix immediately
# - License violations: Replace or get approval
# - Circular dependencies: Plan refactoring

# Step 3: Update vulnerable packages
npm audit fix
# or
yarn upgrade-interactive

# Step 4: Re-run analysis
Use saat-dependencies to verify all critical issues resolved

# Step 5: Document decisions
# Add ADR for any accepted risks or deferred updates
```

---

## 🎯 Integration with CI/CD

### GitHub Actions Example

```yaml
name: Dependency Check
on: [push, pull_request]

jobs:
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run SAAT Dependency Analysis
        run: |
          saat-dependencies scan . --format json --output deps-report.json

      - name: Check for critical vulnerabilities
        run: |
          CRITICAL=$(jq '.summary.vulnerabilities.critical' deps-report.json)
          if [ $CRITICAL -gt 0 ]; then
            echo "❌ Critical vulnerabilities found!"
            exit 1
          fi

      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: dependency-report
          path: deps-report.json
```

---

## 🆘 Troubleshooting

### Too many false positives

- **Common cause**: Transitive dependencies with low-severity CVEs
- **Solution**: Set severity threshold to "high" or higher
- **Prevention**: Focus on direct dependencies and critical issues

### Package has no fix available

- **Common cause**: Vulnerability in unmaintained package
- **Solution**: Find alternative package or apply workaround
- **Prevention**: Check package health before adoption

### Upgrade breaks application

- **Common cause**: Undocumented breaking changes
- **Solution**: Review changelog, use codemod tools, test thoroughly
- **Prevention**: Test upgrades in staging first, use lock files

---

## 🔗 Related Agents

- **saat-security**: Comprehensive security audit including dependencies
- **saat-validate**: Validate architecture before adding new dependencies
- **saat-document**: Document dependency decisions in ADRs

---

## 💡 Dependency Management Tips

1. **Audit Before Adding**: Check health, license, and security before adding dependency
2. **Pin Versions**: Use exact versions in production dependencies
3. **Update Regularly**: Schedule dependency update days
4. **Test Thoroughly**: Run full test suite after updates
5. **Monitor Continuously**: Use Dependabot, Renovate, or Snyk
6. **Document Decisions**: Record why dependencies were chosen
7. **Minimize Dependency Tree**: Use tree-shaking, code splitting
8. **Review Transitive Deps**: Understand what your dependencies depend on

---

**Ready to analyze dependencies?** Provide your project path or manifest files, and let this agent identify vulnerabilities, license issues, and outdated packages!
