# SAAT Claude Code Sub-Agents - Docker Image
# Provides a containerized environment with all SAAT agents pre-installed

FROM ubuntu:22.04

LABEL maintainer="David R. Oliver"
LABEL description="Solution Architects Analysis Toolkit (SAAT) for Claude Code"
LABEL version="1.0"

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive
ENV SAAT_VERSION=1.0

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    bash \
    jq \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create SAAT directories
RUN mkdir -p /saat/agents \
    /saat/examples \
    /saat/scripts \
    /workspace

# Copy SAAT agents
COPY agents/*.md /saat/agents/
COPY examples/ /saat/examples/
COPY scripts/*.sh /saat/scripts/
COPY README.md /saat/
COPY INSTALLATION.md /saat/
COPY AGENTS_GUIDE.md /saat/
COPY ROADMAP.md /saat/

# Make scripts executable
RUN chmod +x /saat/scripts/*.sh

# Create symbolic link for easy access
RUN ln -s /saat/agents /root/.claude/agents || true

# Set working directory
WORKDIR /workspace

# Create helper script for running SAAT
RUN cat > /usr/local/bin/saat << 'EOF'
#!/bin/bash
# SAAT Helper Script

case "$1" in
  list)
    echo "Available SAAT Agents:"
    ls -1 /saat/agents/*.md | xargs -n1 basename | sed 's/.md$//'
    ;;
  install)
    echo "Installing SAAT agents globally..."
    mkdir -p ~/.claude/agents
    cp /saat/agents/*.md ~/.claude/agents/
    echo "✓ SAAT agents installed to ~/.claude/agents/"
    ;;
  examples)
    echo "SAAT Examples:"
    tree /saat/examples/ || find /saat/examples/ -type f
    ;;
  help|--help|-h)
    cat /saat/README.md
    ;;
  version|--version|-v)
    echo "SAAT Version: $SAAT_VERSION"
    ;;
  *)
    echo "SAAT - Solution Architects Analysis Toolkit"
    echo ""
    echo "Usage: saat [command]"
    echo ""
    echo "Commands:"
    echo "  list      - List all available SAAT agents"
    echo "  install   - Install SAAT agents to ~/.claude/agents/"
    echo "  examples  - Show available examples"
    echo "  help      - Show README documentation"
    echo "  version   - Show SAAT version"
    echo ""
    echo "Examples in: /saat/examples/"
    echo "Documentation: /saat/*.md"
    ;;
esac
EOF

RUN chmod +x /usr/local/bin/saat

# Default command
CMD ["/bin/bash"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD test -d /saat/agents && test -f /usr/local/bin/saat || exit 1

# Metadata
LABEL org.opencontainers.image.title="SAAT"
LABEL org.opencontainers.image.description="Solution Architects Analysis Toolkit for Claude Code"
LABEL org.opencontainers.image.vendor="David R. Oliver"
LABEL org.opencontainers.image.version="1.0"
LABEL org.opencontainers.image.url="https://github.com/DavidROliverBA/SAAT-ClaudeCode"
