#!/usr/bin/env bash
# SAAT Interactive Characteristics Generator
# Creates custom architecture characteristics files through guided questions

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Output file
OUTPUT_FILE="${1:-characteristics.json}"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ Error: jq is required but not installed${NC}"
    echo "Install: apt-get install jq (Ubuntu/Debian) or brew install jq (macOS)"
    exit 1
fi

# Display welcome banner
clear
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║${NC}  ${BOLD}SAAT Interactive Characteristics Generator${NC}              ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}  Solution Architects Analysis Toolkit v1.0                ${BLUE}║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}This wizard will help you create a custom architecture characteristics file.${NC}"
echo -e "${CYAN}Answer the questions to define your project's architectural priorities.${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C at any time to cancel.${NC}"
echo ""
read -p "Press Enter to begin..."

# Function: Ask question with default
ask() {
    local prompt="$1"
    local default="$2"
    local result

    echo -ne "${GREEN}${prompt}${NC}"
    if [ -n "$default" ]; then
        echo -ne " ${YELLOW}[${default}]${NC}: "
    else
        echo -ne ": "
    fi

    read -r result
    echo "${result:-$default}"
}

# Function: Ask yes/no question
ask_yes_no() {
    local prompt="$1"
    local default="${2:-n}"
    local result

    echo -ne "${GREEN}${prompt}${NC} ${YELLOW}(y/n) [${default}]${NC}: "
    read -r result
    result="${result:-$default}"

    [[ "$result" =~ ^[Yy] ]]
}

# Function: Ask for importance (1-10)
ask_importance() {
    local characteristic="$1"
    local suggested="$2"
    local result

    while true; do
        echo -ne "${GREEN}Importance of ${characteristic}${NC} ${YELLOW}(1-10) [${suggested}]${NC}: "
        read -r result
        result="${result:-$suggested}"

        if [[ "$result" =~ ^[0-9]+$ ]] && [ "$result" -ge 1 ] && [ "$result" -le 10 ]; then
            echo "$result"
            return
        else
            echo -e "${RED}Please enter a number between 1 and 10${NC}"
        fi
    done
}

# Function: Select from options
select_option() {
    local prompt="$1"
    shift
    local options=("$@")

    echo -e "${GREEN}${prompt}${NC}"
    for i in "${!options[@]}"; do
        echo "  $((i+1)). ${options[$i]}"
    done

    while true; do
        echo -ne "${YELLOW}Select option (1-${#options[@]})${NC}: "
        read -r selection

        if [[ "$selection" =~ ^[0-9]+$ ]] && [ "$selection" -ge 1 ] && [ "$selection" -le "${#options[@]}" ]; then
            echo "${options[$((selection-1))]}"
            return
        else
            echo -e "${RED}Please enter a number between 1 and ${#options[@]}${NC}"
        fi
    done
}

# Start gathering information
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}Step 1: Project Information${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

PROJECT_NAME=$(ask "Project name" "My Project")
PROJECT_DESC=$(ask "Brief description" "")
TEAM_SIZE=$(ask "Team size" "5-10")
BUDGET=$(ask "Budget (USD)" "100000-500000")

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}Step 2: Domain & Industry${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

DOMAIN=$(select_option "Select your domain:" \
    "E-commerce/Retail" \
    "Healthcare" \
    "Financial Services" \
    "SaaS Platform" \
    "Enterprise Application" \
    "IoT/Real-time Systems" \
    "Media/Content Delivery" \
    "Other")

echo ""
INDUSTRY=$(ask "Specific industry" "")

# Compliance requirements based on domain
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}Step 3: Compliance & Regulations${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

COMPLIANCE_REQUIRED=""
if ask_yes_no "Do you have compliance requirements?" "n"; then
    echo ""
    echo "Select applicable compliance frameworks (comma-separated numbers):"
    echo "  1. PCI-DSS (Payment Card Industry)"
    echo "  2. HIPAA (Healthcare)"
    echo "  3. GDPR (Data Protection)"
    echo "  4. SOC2 (Security)"
    echo "  5. ISO 27001"
    echo "  6. CCPA"
    echo "  7. Other"
    echo ""
    read -p "Selection: " compliance_selection

    COMPLIANCE_FRAMEWORKS=()
    [[ "$compliance_selection" =~ 1 ]] && COMPLIANCE_FRAMEWORKS+=("PCI-DSS")
    [[ "$compliance_selection" =~ 2 ]] && COMPLIANCE_FRAMEWORKS+=("HIPAA")
    [[ "$compliance_selection" =~ 3 ]] && COMPLIANCE_FRAMEWORKS+=("GDPR")
    [[ "$compliance_selection" =~ 4 ]] && COMPLIANCE_FRAMEWORKS+=("SOC2")
    [[ "$compliance_selection" =~ 5 ]] && COMPLIANCE_FRAMEWORKS+=("ISO 27001")
    [[ "$compliance_selection" =~ 6 ]] && COMPLIANCE_FRAMEWORKS+=("CCPA")

    COMPLIANCE_REQUIRED=$(IFS=,; echo "${COMPLIANCE_FRAMEWORKS[*]}")
fi

# Suggest importance values based on domain
case "$DOMAIN" in
    "E-commerce/Retail")
        DEFAULT_AVAIL=10; DEFAULT_PERF=9; DEFAULT_SCALE=9; DEFAULT_SEC=10
        ;;
    "Healthcare")
        DEFAULT_AVAIL=10; DEFAULT_PERF=8; DEFAULT_SCALE=7; DEFAULT_SEC=10
        ;;
    "Financial Services")
        DEFAULT_AVAIL=10; DEFAULT_PERF=9; DEFAULT_SCALE=8; DEFAULT_SEC=10
        ;;
    "SaaS Platform")
        DEFAULT_AVAIL=9; DEFAULT_PERF=8; DEFAULT_SCALE=10; DEFAULT_SEC=9
        ;;
    *)
        DEFAULT_AVAIL=8; DEFAULT_PERF=7; DEFAULT_SCALE=7; DEFAULT_SEC=8
        ;;
esac

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}Step 4: Critical Requirements${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

UPTIME_TARGET=$(ask "Target uptime (e.g., 99.9%)" "99.9")
RESPONSE_TIME=$(ask "Max acceptable response time (ms)" "200")
CONCURRENT_USERS=$(ask "Expected concurrent users" "10000")
DATA_SIZE=$(ask "Expected data volume (GB)" "1000")

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}Step 5: Architecture Characteristics Importance${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}Rate each characteristic from 1-10 based on your project needs.${NC}"
echo -e "${CYAN}(10 = Critical, 1 = Not Important)${NC}"
echo ""

# Operational Characteristics
echo -e "${MAGENTA}▶ Operational Characteristics${NC}"
AVAIL_IMP=$(ask_importance "Availability" "$DEFAULT_AVAIL")
PERF_IMP=$(ask_importance "Performance" "$DEFAULT_PERF")
SCALE_IMP=$(ask_importance "Scalability" "$DEFAULT_SCALE")
SEC_IMP=$(ask_importance "Security" "$DEFAULT_SEC")
RELIAB_IMP=$(ask_importance "Reliability" "8")
FAULT_IMP=$(ask_importance "Fault Tolerance" "8")
RECOV_IMP=$(ask_importance "Recoverability" "7")

echo ""
echo -e "${MAGENTA}▶ Structural Characteristics${NC}"
MAINT_IMP=$(ask_importance "Maintainability" "7")
TEST_IMP=$(ask_importance "Testability" "7")
DEPLOY_IMP=$(ask_importance "Deployability" "7")

echo ""
echo -e "${MAGENTA}▶ Cross-Cutting Characteristics${NC}"
CONFIG_IMP=$(ask_importance "Configurability" "6")
EXTEND_IMP=$(ask_importance "Extensibility" "6")
INTEROP_IMP=$(ask_importance "Interoperability" "7")
USAB_IMP=$(ask_importance "Usability" "8")

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}Step 6: Technical Constraints${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

TECH_STACK=$(ask "Primary technology stack" "Node.js, React, PostgreSQL")
CLOUD_PROVIDER=$(select_option "Cloud provider:" "AWS" "Azure" "GCP" "Multi-cloud" "On-premise" "Hybrid")
DEPLOYMENT_MODEL=$(select_option "Deployment model:" "Microservices" "Monolithic" "Serverless" "Hybrid")

echo ""
echo -e "${GREEN}✨ Generating characteristics file...${NC}"

# Build JSON using jq
cat > "$OUTPUT_FILE" << EOF
{
  "projectName": "$PROJECT_NAME",
  "domain": "$DOMAIN",
  "characteristics": [
    {
      "name": "Availability",
      "importance": $AVAIL_IMP,
      "target": $UPTIME_TARGET,
      "reason": "System uptime requirement for business operations"
    },
    {
      "name": "Performance",
      "importance": $PERF_IMP,
      "target": "${RESPONSE_TIME}ms response time",
      "reason": "User experience and system responsiveness"
    },
    {
      "name": "Scalability",
      "importance": $SCALE_IMP,
      "target": "$CONCURRENT_USERS concurrent users",
      "reason": "Handle expected user growth and traffic spikes"
    },
    {
      "name": "Security",
      "importance": $SEC_IMP,
      "target": "Zero vulnerabilities, ${COMPLIANCE_REQUIRED:-standard security}",
      "reason": "Protect sensitive data and maintain trust"
    },
    {
      "name": "Reliability",
      "importance": $RELIAB_IMP,
      "target": "Error rate < 0.1%",
      "reason": "Consistent and predictable system behavior"
    },
    {
      "name": "Fault Tolerance",
      "importance": $FAULT_IMP,
      "target": "Graceful degradation, no cascading failures",
      "reason": "Continue operation despite component failures"
    },
    {
      "name": "Recoverability",
      "importance": $RECOV_IMP,
      "target": "RTO < 15 minutes, RPO < 5 minutes",
      "reason": "Quick recovery from failures or disasters"
    },
    {
      "name": "Maintainability",
      "importance": $MAINT_IMP,
      "target": "Code quality > 80%",
      "reason": "Easy to understand, modify, and enhance"
    },
    {
      "name": "Testability",
      "importance": $TEST_IMP,
      "target": "80% code coverage",
      "reason": "Comprehensive testing capabilities"
    },
    {
      "name": "Deployability",
      "importance": $DEPLOY_IMP,
      "target": "Deploy multiple times per day with zero downtime",
      "reason": "Fast and safe deployment process"
    },
    {
      "name": "Configurability",
      "importance": $CONFIG_IMP,
      "target": "Feature flags, runtime config changes",
      "reason": "Flexible configuration without code changes"
    },
    {
      "name": "Extensibility",
      "importance": $EXTEND_IMP,
      "target": "Plugin architecture for new features",
      "reason": "Easy to add new functionality"
    },
    {
      "name": "Interoperability",
      "importance": $INTEROP_IMP,
      "target": "RESTful APIs, standard formats",
      "reason": "Integrate with external systems"
    },
    {
      "name": "Usability",
      "importance": $USAB_IMP,
      "target": "Intuitive interface, minimal training",
      "reason": "User satisfaction and adoption"
    }
  ],
  "businessContext": {
    "description": "$PROJECT_DESC",
    "industry": "$INDUSTRY",
    "teamSize": "$TEAM_SIZE",
    "budget": "$BUDGET",
    "complianceRequirements": [${COMPLIANCE_REQUIRED:+$(echo "\"$COMPLIANCE_REQUIRED\"" | sed 's/,/","/g')}],
    "criticalBusinessMetrics": [
      "Uptime: $UPTIME_TARGET%",
      "Response time: ${RESPONSE_TIME}ms",
      "Concurrent users: $CONCURRENT_USERS",
      "Data volume: ${DATA_SIZE}GB"
    ]
  },
  "technicalConstraints": {
    "technologyStack": "$TECH_STACK",
    "cloudProvider": "$CLOUD_PROVIDER",
    "deploymentModel": "$DEPLOYMENT_MODEL"
  }
}
EOF

# Format JSON with jq
jq '.' "$OUTPUT_FILE" > "${OUTPUT_FILE}.tmp" && mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"

echo ""
echo -e "${GREEN}✅ Characteristics file created successfully!${NC}"
echo -e "${BLUE}📄 Output: $OUTPUT_FILE${NC}"
echo ""
echo -e "${CYAN}Summary:${NC}"
echo "  Project: $PROJECT_NAME"
echo "  Domain: $DOMAIN"
echo "  Top Priorities:"

# Show top 3 priorities
jq -r '.characteristics | sort_by(.importance) | reverse | .[0:3] | .[] | "    - \(.name): \(.importance)/10"' "$OUTPUT_FILE"

echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Review and customize $OUTPUT_FILE"
echo "  2. Use with saat-analyze-characteristics agent:"
echo "     ${CYAN}Task tool with subagent_type=saat-analyze-characteristics${NC}"
echo "  3. View example: ${CYAN}cat examples/characteristics/ecommerce-characteristics.json${NC}"
echo ""
echo -e "${GREEN}🎉 Ready to analyze your architecture!${NC}"
