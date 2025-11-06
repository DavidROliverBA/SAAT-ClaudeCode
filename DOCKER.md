# SAAT Docker Image

Run SAAT (Solution Architects Analysis Toolkit) in a Docker container for easy deployment and consistent environment.

---

## 🚀 Quick Start

### Pull Pre-built Image (Coming Soon)

```bash
docker pull davidroliver/saat:latest
docker run -it -v $(pwd):/workspace davidroliver/saat:latest
```

### Build Locally

```bash
# Clone repository
git clone https://github.com/DavidROliverBA/SAAT-ClaudeCode.git
cd SAAT-ClaudeCode

# Build image
docker build -t saat:latest .

# Run container
docker run -it -v $(pwd):/workspace saat:latest
```

### Using Docker Compose

```bash
# Start SAAT container
docker-compose up -d saat

# Enter container
docker-compose exec saat bash

# Inside container
saat list
saat install
```

---

## 📦 What's Included

The Docker image contains:

- ✅ All 11 SAAT agents pre-installed
- ✅ Example files for 5 domains
- ✅ Sample outputs from all agents
- ✅ Complete documentation
- ✅ Helper scripts
- ✅ `saat` CLI tool

---

## 🔧 Usage

### Inside the Container

The `saat` command provides quick access to SAAT functionality:

```bash
# List all available agents
saat list

# Install agents to ~/.claude/agents/
saat install

# View examples
saat examples

# Show documentation
saat help

# Show version
saat version
```

### Directory Structure

```
/saat/
├── agents/          # All 11 SAAT agent files
├── examples/        # Example characteristics and outputs
├── scripts/         # Installation scripts
├── README.md        # Main documentation
├── AGENTS_GUIDE.md  # Complete agents reference
└── ROADMAP.md       # Development roadmap

/workspace/          # Your project files (mounted)
```

### Working with Your Project

```bash
# Run container with your project mounted
docker run -it \
  -v /path/to/your/project:/workspace \
  -v ~/.claude/agents:/root/.claude/agents \
  saat:latest

# Inside container, your project is in /workspace
cd /workspace
ls
```

---

## 💡 Use Cases

### 1. Analyze Existing Project

```bash
# Start container with project mounted
docker run -it -v ~/projects/my-app:/workspace saat:latest

# Inside container
cd /workspace
# Use Claude Code Task tool to invoke agents
# Example: saat-discover, saat-generate, etc.
```

### 2. Portable Development Environment

```bash
# Use Docker Compose for persistent environment
docker-compose up -d saat
docker-compose exec saat bash

# Install agents globally in container
saat install

# Work with examples
cp /saat/examples/characteristics/ecommerce-characteristics.json /workspace/
```

### 3. CI/CD Integration

```dockerfile
# In your CI/CD pipeline
FROM davidroliver/saat:latest

COPY . /workspace
WORKDIR /workspace

# Run SAAT analysis
RUN saat install
# Add your CI/CD steps here
```

---

## 🌐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SAAT_VERSION` | `1.0` | SAAT toolkit version |
| `TZ` | `UTC` | Container timezone |

---

## 📂 Volumes

### Recommended Mounts

```bash
docker run -it \
  -v $(pwd):/workspace \                    # Your project
  -v ~/.claude/agents:/root/.claude/agents \ # Claude agents
  -v ~/saat-output:/output \                 # Analysis outputs
  saat:latest
```

| Host Path | Container Path | Purpose |
|-----------|---------------|---------|
| `$(pwd)` | `/workspace` | Your project files |
| `~/.claude/agents` | `/root/.claude/agents` | Claude Code agents |
| `~/saat-output` | `/output` | Analysis outputs |

---

## 🔨 Building Custom Image

### Extend Base Image

```dockerfile
FROM davidroliver/saat:latest

# Add your customizations
RUN apt-get update && apt-get install -y \
    python3 \
    nodejs

# Copy custom characteristics
COPY my-characteristics.json /saat/examples/

# Set custom environment
ENV MY_PROJECT_NAME=my-app
```

### Build with Arguments

```bash
docker build \
  --build-arg SAAT_VERSION=1.0 \
  -t saat:custom \
  .
```

---

## 🐳 Docker Compose Examples

### Basic Setup

```yaml
version: '3.8'
services:
  saat:
    image: saat:latest
    volumes:
      - ./:/workspace
    command: bash
    stdin_open: true
    tty: true
```

### With Multiple Services

```yaml
version: '3.8'
services:
  saat:
    image: saat:latest
    volumes:
      - ./:/workspace
    depends_on:
      - postgres

  postgres:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: example
```

---

## 🛠️ Troubleshooting

### Issue: Permission Denied

**Solution**: Run container with your user ID
```bash
docker run -it --user $(id -u):$(id -g) \
  -v $(pwd):/workspace \
  saat:latest
```

### Issue: Agents Not Found

**Solution**: Install agents in container
```bash
docker exec -it saat-toolkit saat install
```

### Issue: Cannot Access Project Files

**Solution**: Check volume mount
```bash
# Verify mount
docker inspect saat-toolkit | grep Mounts -A 10

# Remount if needed
docker run -it -v $(pwd):/workspace:rw saat:latest
```

---

## 📊 Image Details

**Base Image**: Ubuntu 22.04
**Size**: ~200MB
**Architecture**: linux/amd64 (linux/arm64 coming soon)

### What's Installed

- bash
- curl, wget
- git
- jq (JSON processor)
- All SAAT agents and examples

---

## 🚦 Health Check

The image includes a health check:

```bash
# Check if container is healthy
docker ps --filter "name=saat-toolkit"

# Manual health check
docker exec saat-toolkit test -d /saat/agents && echo "Healthy"
```

---

## 🔄 Updates

### Update to Latest Version

```bash
# Pull latest image
docker pull davidroliver/saat:latest

# Or rebuild locally
git pull
docker build -t saat:latest .
```

---

## 📝 Best Practices

1. **Always mount your project**: `-v $(pwd):/workspace`
2. **Persist Claude agents**: `-v ~/.claude/agents:/root/.claude/agents`
3. **Use Docker Compose** for complex setups
4. **Tag your images**: `docker build -t saat:v1.0 .`
5. **Clean up**: `docker system prune` to remove old images

---

## 🎯 Example Workflows

### Workflow 1: Quick Analysis

```bash
# One-liner: Run SAAT and list agents
docker run --rm -it \
  -v $(pwd):/workspace \
  saat:latest \
  bash -c "saat list && saat install && bash"
```

### Workflow 2: Persistent Environment

```bash
# Create named container
docker-compose up -d saat

# Use it repeatedly
docker-compose exec saat saat install
docker-compose exec saat bash

# Stop when done
docker-compose down
```

### Workflow 3: CI/CD Pipeline

```yaml
# .github/workflows/saat-analysis.yml
jobs:
  analyze:
    runs-on: ubuntu-latest
    container:
      image: davidroliver/saat:latest
    steps:
      - uses: actions/checkout@v3
      - run: saat install
      - run: # Your analysis steps
```

---

## 🌟 Advanced Usage

### Multi-Stage Build

```dockerfile
# Stage 1: Analysis
FROM davidroliver/saat:latest AS analyzer
WORKDIR /workspace
COPY . .
RUN saat install

# Stage 2: Runtime
FROM ubuntu:22.04
COPY --from=analyzer /workspace/analysis /analysis
```

### Custom Entry Point

```dockerfile
FROM davidroliver/saat:latest

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["saat install && bash"]
```

---

## 📚 References

- **GitHub**: https://github.com/DavidROliverBA/SAAT-ClaudeCode
- **Documentation**: [README.md](./README.md), [AGENTS_GUIDE.md](./AGENTS_GUIDE.md)
- **Examples**: [examples/README.md](./examples/README.md)

---

**Ready to containerize your architecture analysis? Build and run SAAT in Docker!** 🐳
