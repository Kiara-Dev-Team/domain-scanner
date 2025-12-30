# What We Build

## Product Overview

The Domain Scanner is a business-oriented security scanning platform built as an enhanced layer on top of [NUCLEI](https://github.com/projectdiscovery/nuclei). We transform technical security scan results into actionable business intelligence.

## Core Product Concept

### Not a Security Scanner - A Business Decision Support Tool

While we leverage NUCLEI's powerful scanning capabilities, our product is fundamentally different:

- **Traditional Scanner**: "Found 47 vulnerabilities, 3 critical CVEs"
- **Our Scanner**: "Financial risk detected: Payment processing vulnerability could impact revenue. Immediate action required."

### Three-Layer Architecture

1. **Scanning Layer** (NUCLEI)
   - Performs technical security scanning
   - Detects vulnerabilities, misconfigurations, and exposures
   - Leverages NUCLEI's extensive template library

2. **Translation Layer** (Our Innovation)
   - Converts technical findings to business risks
   - Applies business context and impact analysis
   - Categorizes by risk type (financial, governance, operational)
   - Generates action recommendations

3. **Experience Layer** (Our Innovation)
   - Business-friendly user interface
   - Mobile-responsive design
   - Progressive disclosure of technical details
   - Decision-support workflows

## What Makes Us Different

### Business-First Interpretation

Every security finding is translated into business language:

| Technical Output | Our Business Translation |
|-----------------|-------------------------|
| "TLS 1.0 detected on port 443" | "**Governance Risk**: Outdated encryption exposes customer data. Compliance violation likely. Priority: High" |
| "CVE-2023-XXXX: RCE vulnerability" | "**Operational Risk**: Server compromise possible. Service disruption likely. Revenue impact: High. Action: Immediate patch required" |
| "Exposed .git directory" | "**Financial Risk**: Source code exposure enables targeted attacks. Intellectual property at risk. Action: Remove immediately" |

### Action-Oriented Guidance

We never present a finding without guidance:

- **What**: Clear explanation of what was found
- **Why it matters**: Business impact in concrete terms
- **What to do**: Specific next actions
- **Who owns it**: Security, IT Ops, Vendor Management, or Management
- **When**: Priority level (Now / Soon / Monitor)

### Target User Experience

Our product is designed for business decision makers, not security experts:

#### What Users Should Experience:

1. **Immediate Situational Awareness**
   - "Are we exposed?" answered in seconds
   - Clear, high-level understanding of attack surface
   - Visual summaries before technical details

2. **Business-Oriented Interpretation**
   - Findings framed as business risks, not technical defects
   - Impact on revenue, compliance, and operations
   - No unexplained security jargon

3. **Clear Guidance on Next Actions**
   - Explicit recommendations for every finding
   - Priority guidance and ownership hints
   - Confidence that the tool is guiding, not just reporting

4. **Decision Support, Not Alert Fatigue**
   - Aggregation over noise
   - Material risk emphasis
   - Structured, calm information delivery

5. **Progressive Disclosure**
   - High-level insights by default
   - Technical details available on demand
   - "View technical details" for engineers

6. **Confidence and Control**
   - Transparent severity explanations
   - Clear boundaries of coverage
   - No hidden or ignored critical issues

#### What Users Should NOT Experience:

- ❌ Raw security tool output by default
- ❌ Unexplained acronyms (CVE, CVSS, RCE, TLS)
- ❌ Ambiguity after detection
- ❌ Fear without direction
- ❌ Technical jargon assuming security expertise

## Key Features

### 1. Business Risk Dashboard

- Executive summary of security posture
- Risk categorization (Financial, Governance, Operational)
- Trend indicators and change detection
- Mobile-responsive design

### 2. Intelligent Findings Translation

- Automatic business impact analysis
- Risk scoring from business perspective
- Natural language explanations
- Industry-specific context (where applicable)

### 3. Action Recommendation Engine

- Prioritized remediation guidance
- Ownership assignment suggestions
- Resource requirement estimates
- Implementation complexity indicators

### 4. Dual-Mode Output

- **Business Mode** (default): High-level, action-oriented
- **Technical Mode** (on-demand): Full NUCLEI output for engineers

### 5. Reporting and Communication

- Executive-ready reports
- Stakeholder-specific views
- Export capabilities for different audiences
- Integration with business systems

## Product Principles

### Design North Star

After every session, users should know:

1. **Where risk exists** - Clear identification of exposure
2. **Why it matters to the business** - Impact on operations, revenue, compliance
3. **What decision or action is expected next** - Clear guidance on next steps

If any screen fails to answer at least one of these, it should be reconsidered.

### Quality Principles

- **Accuracy**: All business translations are grounded in real technical findings
- **Clarity**: Zero ambiguity in recommendations
- **Completeness**: No critical finding without action guidance
- **Consistency**: Same risk types explained the same way
- **Confidence**: Transparent about limitations and uncertainties

## Competitive Differentiation

| Aspect | Traditional Scanners | Our Scanner |
|--------|---------------------|-------------|
| **Primary User** | Security engineers | Business decision makers |
| **Output Language** | Technical/Security jargon | Business language |
| **After Detection** | Lists vulnerabilities | Provides action plan |
| **Risk Framing** | Technical severity (CVSS) | Business impact (revenue, compliance, ops) |
| **Guidance** | Minimal or none | Comprehensive "what to do next" |
| **UI/UX** | Tool-centric | User-outcome-centric |
| **Detail Level** | Everything at once | Progressive disclosure |

## Use Cases

### Executive Risk Review
> "Show me our security posture and any business-critical risks requiring executive attention."

### Pre-Investment Due Diligence
> "Assess target company's security exposure and translate to financial risk for M&A decision."

### Board Reporting
> "Generate quarterly security risk report for board review with business impact context."

### Operational Risk Management
> "Monitor external attack surface and alert on changes that affect operations or compliance."

### Vendor Security Assessment
> "Evaluate third-party vendor security posture in business terms for contract decisions."

## Success Metrics

We measure success by:

1. **User Comprehension**: Can non-technical users understand the output?
2. **Action Rate**: Do users take action on recommendations?
3. **Time to Decision**: How quickly can users make informed decisions?
4. **Risk Reduction**: Are business risks actually mitigated?
5. **User Confidence**: Do users trust the tool's guidance?

## What We Are NOT Building

- Not a replacement for NUCLEI (we build on top of it)
- Not a penetration testing tool
- Not a compliance certification tool
- Not a security training platform
- Not another technical security scanner

We are building a **business intelligence layer** for security scanning.
