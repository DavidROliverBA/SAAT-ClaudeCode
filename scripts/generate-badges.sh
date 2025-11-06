#!/usr/bin/env bash
# SAAT Badge Generator
# Generates shields.io badges for architecture analysis scores

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default input file
INPUT_FILE="${1:-analysis-results.json}"
OUTPUT_FILE="${2:-badges.md}"

echo -e "${BLUE}🎖️  SAAT Badge Generator${NC}"
echo "================================"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo -e "${RED}❌ Error: Input file '$INPUT_FILE' not found${NC}"
    echo ""
    echo "Usage: $0 <analysis-results.json> [output-file.md]"
    echo ""
    echo "Examples:"
    echo "  $0 analysis-results.json"
    echo "  $0 archchar-analysis.json badges.md"
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ Error: jq is required but not installed${NC}"
    echo "Install: apt-get install jq (Ubuntu/Debian) or brew install jq (macOS)"
    exit 1
fi

echo -e "${GREEN}📄 Reading: $INPUT_FILE${NC}"

# Extract scores from JSON
OVERALL_SCORE=$(jq -r '.overallScore // .validationScore // .securityScore // 0' "$INPUT_FILE")
PROJECT_NAME=$(jq -r '.projectName // "Project"' "$INPUT_FILE")

# Determine overall score color
if [ "$OVERALL_SCORE" -ge 90 ]; then
    OVERALL_COLOR="brightgreen"
    OVERALL_EMOJI="🟢"
elif [ "$OVERALL_SCORE" -ge 75 ]; then
    OVERALL_COLOR="green"
    OVERALL_EMOJI="🟢"
elif [ "$OVERALL_SCORE" -ge 60 ]; then
    OVERALL_COLOR="yellow"
    OVERALL_EMOJI="🟡"
elif [ "$OVERALL_SCORE" -ge 40 ]; then
    OVERALL_COLOR="orange"
    OVERALL_EMOJI="🟠"
else
    OVERALL_COLOR="red"
    OVERALL_EMOJI="🔴"
fi

# Create badges markdown
cat > "$OUTPUT_FILE" << EOF
# ${PROJECT_NAME} - Architecture Badges

## Overall Score

![Overall Score](https://img.shields.io/badge/Architecture_Score-${OVERALL_SCORE}%25-${OVERALL_COLOR}?style=for-the-badge&logo=checkmarx)

EOF

# Check if this is an architecture characteristics analysis
if jq -e '.characteristics' "$INPUT_FILE" > /dev/null 2>&1; then
    echo -e "${GREEN}📊 Detected: Architecture Characteristics Analysis${NC}"

    # Extract characteristic scores
    echo "" >> "$OUTPUT_FILE"
    echo "## Architecture Characteristics" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

    # Get all characteristics
    CHAR_COUNT=$(jq '.characteristics | length' "$INPUT_FILE")

    for i in $(seq 0 $((CHAR_COUNT - 1))); do
        CHAR_NAME=$(jq -r ".characteristics[$i].name" "$INPUT_FILE")
        CHAR_SCORE=$(jq -r ".characteristics[$i].currentScore" "$INPUT_FILE")
        CHAR_STATUS=$(jq -r ".characteristics[$i].status" "$INPUT_FILE")
        CHAR_PRIORITY=$(jq -r ".characteristics[$i].priority" "$INPUT_FILE")

        # Determine color based on score
        if [ "$CHAR_SCORE" -ge 90 ]; then
            CHAR_COLOR="brightgreen"
        elif [ "$CHAR_SCORE" -ge 75 ]; then
            CHAR_COLOR="green"
        elif [ "$CHAR_SCORE" -ge 60 ]; then
            CHAR_COLOR="yellow"
        elif [ "$CHAR_SCORE" -ge 40 ]; then
            CHAR_COLOR="orange"
        else
            CHAR_COLOR="red"
        fi

        # Priority badge color
        case "$CHAR_PRIORITY" in
            critical)
                PRIORITY_COLOR="critical"
                ;;
            high)
                PRIORITY_COLOR="important"
                ;;
            medium)
                PRIORITY_COLOR="yellow"
                ;;
            low)
                PRIORITY_COLOR="informational"
                ;;
            *)
                PRIORITY_COLOR="lightgrey"
                ;;
        esac

        echo "![${CHAR_NAME}](https://img.shields.io/badge/${CHAR_NAME}-${CHAR_SCORE}%25-${CHAR_COLOR}) ![Priority](https://img.shields.io/badge/Priority-${CHAR_PRIORITY}-${PRIORITY_COLOR})" >> "$OUTPUT_FILE"
    done

    # Add summary badges
    MET=$(jq -r '.summary.met' "$INPUT_FILE")
    PARTIAL=$(jq -r '.summary.partial' "$INPUT_FILE")
    NOT_MET=$(jq -r '.summary.notMet' "$INPUT_FILE")

    echo "" >> "$OUTPUT_FILE"
    echo "## Summary" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "![Met](https://img.shields.io/badge/Met-${MET}-brightgreen) ![Partial](https://img.shields.io/badge/Partial-${PARTIAL}-yellow) ![Not Met](https://img.shields.io/badge/Not_Met-${NOT_MET}-red)" >> "$OUTPUT_FILE"
fi

# Check if this is a validation report
if jq -e '.validationResults' "$INPUT_FILE" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Detected: Validation Report${NC}"

    ERRORS=$(jq -r '.summary.errors' "$INPUT_FILE")
    WARNINGS=$(jq -r '.summary.warnings' "$INPUT_FILE")
    INFO=$(jq -r '.summary.info' "$INPUT_FILE")

    echo "" >> "$OUTPUT_FILE"
    echo "## Validation Status" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "![Errors](https://img.shields.io/badge/Errors-${ERRORS}-red) ![Warnings](https://img.shields.io/badge/Warnings-${WARNINGS}-yellow) ![Info](https://img.shields.io/badge/Info-${INFO}-blue)" >> "$OUTPUT_FILE"

    # Compliance check
    if jq -e '.compliance' "$INPUT_FILE" > /dev/null 2>&1; then
        COMPLIANCE_FRAMEWORK=$(jq -r '.compliance.framework' "$INPUT_FILE")
        COMPLIANCE_SCORE=$(jq -r '.compliance.score' "$INPUT_FILE")
        COMPLIANCE_PASSED=$(jq -r '.compliance.passed' "$INPUT_FILE")

        if [ "$COMPLIANCE_PASSED" = "true" ]; then
            COMPLIANCE_COLOR="brightgreen"
            COMPLIANCE_LABEL="PASSED"
        else
            COMPLIANCE_COLOR="red"
            COMPLIANCE_LABEL="FAILED"
        fi

        echo "" >> "$OUTPUT_FILE"
        echo "## Compliance" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "![${COMPLIANCE_FRAMEWORK}](https://img.shields.io/badge/${COMPLIANCE_FRAMEWORK}-${COMPLIANCE_LABEL}-${COMPLIANCE_COLOR}) ![Score](https://img.shields.io/badge/Score-${COMPLIANCE_SCORE}%25-${COMPLIANCE_COLOR})" >> "$OUTPUT_FILE"
    fi
fi

# Check if this is a security report
if jq -e '.securityScore' "$INPUT_FILE" > /dev/null 2>&1; then
    echo -e "${GREEN}🔒 Detected: Security Report${NC}"

    SECURITY_SCORE=$(jq -r '.securityScore' "$INPUT_FILE")
    CRITICAL=$(jq '[.findings[] | select(.severity=="CRITICAL")] | length' "$INPUT_FILE")
    HIGH=$(jq '[.findings[] | select(.severity=="HIGH")] | length' "$INPUT_FILE")
    MEDIUM=$(jq '[.findings[] | select(.severity=="MEDIUM")] | length' "$INPUT_FILE")
    LOW=$(jq '[.findings[] | select(.severity=="LOW")] | length' "$INPUT_FILE")

    # Determine security score color
    if [ "$SECURITY_SCORE" -ge 90 ]; then
        SEC_COLOR="brightgreen"
    elif [ "$SECURITY_SCORE" -ge 75 ]; then
        SEC_COLOR="green"
    elif [ "$SECURITY_SCORE" -ge 60 ]; then
        SEC_COLOR="yellow"
    else
        SEC_COLOR="red"
    fi

    echo "" >> "$OUTPUT_FILE"
    echo "## Security Analysis" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "![Security Score](https://img.shields.io/badge/Security_Score-${SECURITY_SCORE}%25-${SEC_COLOR}) ![Critical](https://img.shields.io/badge/Critical-${CRITICAL}-critical) ![High](https://img.shields.io/badge/High-${HIGH}-important) ![Medium](https://img.shields.io/badge/Medium-${MEDIUM}-yellow) ![Low](https://img.shields.io/badge/Low-${LOW}-informational)" >> "$OUTPUT_FILE"
fi

# Add SAAT branding
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "![SAAT](https://img.shields.io/badge/Analyzed_by-SAAT_1.0-blue?style=for-the-badge&logo=architecture) ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "_Generated by [SAAT](https://github.com/DavidROliverBA/SAAT-ClaudeCode) - Solution Architects Analysis Toolkit_" >> "$OUTPUT_FILE"

echo ""
echo -e "${GREEN}✅ Badges generated successfully!${NC}"
echo -e "${BLUE}📄 Output: $OUTPUT_FILE${NC}"
echo ""
echo "Badge Summary:"
echo "  ${OVERALL_EMOJI} Overall Score: $OVERALL_SCORE%"

if jq -e '.characteristics' "$INPUT_FILE" > /dev/null 2>&1; then
    echo "  📊 Characteristics: $CHAR_COUNT analyzed"
fi

if jq -e '.validationResults' "$INPUT_FILE" > /dev/null 2>&1; then
    echo "  ✅ Validation: $ERRORS errors, $WARNINGS warnings"
fi

if jq -e '.securityScore' "$INPUT_FILE" > /dev/null 2>&1; then
    echo "  🔒 Security: $CRITICAL critical, $HIGH high severity issues"
fi

echo ""
echo "To use in your README.md:"
echo "  cat $OUTPUT_FILE >> README.md"
