# SAAT GitHub Actions Template

Automate architecture analysis in your CI/CD pipeline with SAAT.

## 🚀 Quick Setup

### 1. Copy Workflow File

```bash
# Create GitHub Actions directory
mkdir -p .github/workflows

# Copy SAAT analysis workflow
cp templates/github-actions/saat-analysis.yml .github/workflows/
```

### 2. Configure Environment Variables

Edit `.github/workflows/saat-analysis.yml` to customize:

```yaml
env:
  SAAT_VERSION: "1.0"
  MIN_SCORE_THRESHOLD: 70        # Minimum acceptable architecture score
  BLOCK_ON_CRITICAL: true         # Fail PR if critical issues found
```

### 3. Prepare Architecture Model

The workflow expects an `architecture.json` file in your repository root. Generate it using:

```bash
# Option 1: Discover from existing codebase
# Use Claude Code with saat-discover agent

# Option 2: Generate from requirements
# Use Claude Code with saat-requirements + saat-generate agents

# Option 3: Use example
cp examples/sample-outputs/architecture-sample.json architecture.json
```

### 4. Commit and Push

```bash
git add .github/workflows/saat-analysis.yml architecture.json
git commit -m "Add SAAT architecture analysis workflow"
git push
```

## 📋 What It Does

### On Pull Request

1. **Validates Architecture Model** - Checks structure and completeness
2. **Analyzes Characteristics** - Evaluates 14 architecture characteristics
3. **Security Scan** - Identifies vulnerabilities and compliance gaps
4. **Generates Badges** - Creates shields.io badges for README
5. **Posts PR Comment** - Adds analysis results as PR comment
6. **Quality Gate** - Blocks PR if critical issues found (optional)

### On Push to Main

1. Runs full analysis
2. Generates architecture documentation
3. Deploys docs to GitHub Pages (optional)

## ⚙️ Configuration Options

### Quality Gates

Control when the workflow should fail:

```yaml
env:
  # Minimum architecture score (0-100)
  MIN_SCORE_THRESHOLD: 70

  # Block on critical issues
  BLOCK_ON_CRITICAL: true
```

### Trigger Events

Customize when analysis runs:

```yaml
on:
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'src/**'                 # Only on source changes
      - 'architecture/**'
      - 'architecture.json'

  push:
    branches: [ main ]

  schedule:
    - cron: '0 0 * * 0'         # Weekly on Sunday

  workflow_dispatch:             # Manual trigger
```

### Docker Image

Choose SAAT Docker image source:

```yaml
# Option 1: Pre-built image (recommended)
container:
  image: davidroliver/saat:latest

# Option 2: GitHub Container Registry
container:
  image: ghcr.io/${{ github.repository }}/saat:latest

# Option 3: Build from Dockerfile
steps:
  - name: Build SAAT Image
    run: docker build -t saat:latest .
```

## 📊 PR Comment Example

The workflow posts a comment on PRs with analysis results:

```markdown
## 🏗️ SAAT Architecture Analysis Report

![Overall Score](https://img.shields.io/badge/Architecture_Score-72%25-yellow)

### 🟡 Overall Architecture Score: 72/100

#### 🔝 Top Architecture Recommendations:
1. **Active-Active Payment Service Deployment** (Availability)
   - Severity: critical
   - Effort: 3-5 days
2. **Multi-AZ Database Deployment** (Availability)
   - Severity: critical
   - Effort: 2-3 days
...

#### 📊 Summary:
- ✅ Met: 4 characteristics
- ⚠️  Partial: 8 characteristics
- ❌ Not Met: 2 characteristics
- 🔒 Security Score: 68/100
```

## 🔒 Secrets and Permissions

### Required Permissions

The workflow needs these permissions (automatically granted):

```yaml
permissions:
  contents: read
  pull-requests: write
  issues: write
```

### Optional: Claude Code API (Future)

If using Claude Code API for analysis:

```yaml
env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

Add secret in **Settings → Secrets → Actions → New repository secret**

## 📂 Artifacts

Analysis results are uploaded as artifacts:

- `analysis-results.json` - Architecture characteristics analysis
- `security-results.json` - Security scan results
- `validation-results.json` - Validation report
- `badges.md` - Shields.io badges markdown

Download from **Actions → Workflow Run → Artifacts**

## 🚨 Blocking PRs

### Enable Blocking

Set `BLOCK_ON_CRITICAL: true` to fail workflow on:

- Overall score < threshold
- Critical architecture gaps
- Critical security vulnerabilities

### Disable Blocking (Report Only)

Set `BLOCK_ON_CRITICAL: false` for informational reports without blocking:

```yaml
env:
  BLOCK_ON_CRITICAL: false
```

## 🎨 Badge Integration

### Auto-Generated Badges

The workflow generates badges automatically. Add to your README:

```markdown
<!-- SAAT Badges - Auto-updated by workflow -->
![Architecture Score](https://img.shields.io/badge/Architecture_Score-72%25-yellow)
![Security](https://img.shields.io/badge/Security_Score-68%25-yellow)
```

### Dynamic Badge from Workflow

Use GitHub Actions badge:

```markdown
![SAAT Analysis](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/saat-analysis.yml/badge.svg)
```

## 📚 Documentation Deployment

### Enable GitHub Pages

Uncomment the `documentation` job to auto-deploy docs:

```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./docs
```

Then enable Pages in **Settings → Pages → Source: gh-pages**

## 🔧 Customization

### Add Custom Checks

```yaml
- name: Custom Architecture Rule
  run: |
    # Check for specific patterns
    MICROSERVICES=$(jq '.containers | length' architecture.json)
    if [ "$MICROSERVICES" -gt 20 ]; then
      echo "⚠️  Warning: Too many microservices ($MICROSERVICES)"
    fi
```

### Integrate with Other Tools

```yaml
- name: SonarQube Scan
  run: sonar-scanner

- name: Snyk Security
  uses: snyk/actions/node@master
```

### Notify Slack/Teams

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Architecture score: ${{ steps.quality_gate.outputs.score }}%'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 📝 Best Practices

1. **Start with Report Mode** - Set `BLOCK_ON_CRITICAL: false` initially
2. **Gradual Threshold Increase** - Start at 50%, increase to 70%+
3. **Keep Model Updated** - Re-run saat-discover after major changes
4. **Review Comments** - Have team review analysis in PRs
5. **Track Progress** - Monitor score trends over time
6. **Document Exceptions** - Use ADRs for architectural decisions

## 🐛 Troubleshooting

### Workflow Fails: "No architecture model found"

**Solution**: Create `architecture.json`:

```bash
# Generate from codebase
# Use saat-discover agent in Claude Code

# Or copy example
cp examples/sample-outputs/architecture-sample.json architecture.json
```

### PR Comment Not Posted

**Check**:
1. Workflow has `pull-requests: write` permission
2. Branch protection allows GitHub Actions
3. No conflicts with other PR comment bots

### Quality Gate Always Fails

**Check**:
1. Threshold is realistic (`MIN_SCORE_THRESHOLD: 50` for starting)
2. Critical issues are genuine blockers
3. Consider setting `BLOCK_ON_CRITICAL: false`

### Docker Image Pull Fails

**Solution**: Use build from source:

```yaml
steps:
  - name: Build SAAT
    run: docker build -t saat:latest .
  - name: Run Analysis
    run: docker run saat:latest saat list
```

## 📖 Examples

### Example 1: Strict Quality Gate

```yaml
env:
  MIN_SCORE_THRESHOLD: 85
  BLOCK_ON_CRITICAL: true
```

### Example 2: Report Only (No Blocking)

```yaml
env:
  MIN_SCORE_THRESHOLD: 0
  BLOCK_ON_CRITICAL: false
```

### Example 3: Weekly Audit

```yaml
on:
  schedule:
    - cron: '0 9 * * 1'  # Monday 9 AM
```

## 🔗 Related

- [SAAT Agents Guide](../../AGENTS_GUIDE.md)
- [Docker Documentation](../../DOCKER.md)
- [GitHub Actions Docs](https://docs.github.com/actions)

---

**Questions?** Open an issue at https://github.com/DavidROliverBA/SAAT-ClaudeCode/issues
