# Why We Build the Domain Scanner

## Background of the Domain Scanner Project

This project is based on [NUCLEI](https://github.com/projectdiscovery/nuclei), an open-source attack surface domain scanner. NUCLEI is exceptionally well-engineered, with no licensing issues, making it an ideal foundation for our project.

## The Problem We're Solving

### Issue #1: Overly Technical Output

While NUCLEI is highly capable in terms of domain scanning functionality, its output is overly technical. The results are understandable for engineers and security specialists, but users without deep security expertise—particularly those on the business side—find the output difficult to interpret, making it challenging to translate findings into concrete actions.

### Issue #2: Lack of Business Context

Existing domain scanners fail to translate technical findings into business impact. They present raw security data without context on:

- **Financial risk** - How vulnerabilities affect revenue, costs, or financial exposure
- **Management and governance risk** - Compliance, regulatory, and oversight implications
- **Operational quality** - Impact on reliability, performance, and service delivery

### Issue #3: No Guidance After Discovery

When vulnerabilities associated with CVE identifiers are detected, there is often insufficient guidance regarding:

- How the vulnerability should be interpreted
- How it should be prioritized
- How it should be translated into concrete actions

The absence of this "what should we do next?" guidance represents a significant gap in current tools.

## Our Solution

### For Business Decision Makers

We recognize that the primary users are business-oriented decision makers—executives, product owners, risk managers, operations leaders—who:

- Do not have deep security or infrastructure expertise
- Are responsible for risk ownership and action
- Have limited time and high accountability for outcomes
- Need to make informed decisions quickly

### Translating Technical to Business Value

Our approach transforms scan results into actionable business intelligence by:

1. **Risk Translation**: Converting technical findings into business risk categories (financial, governance, operational)
2. **Contextual Interpretation**: Explaining what findings mean for business operations and strategy
3. **Action Guidance**: Providing clear "what to do next" recommendations with priority levels
4. **Decision Support**: Structuring information to support executive decision-making, not just alert on issues

### Differentiation Through Value

The primary goal of this project is to make domain scanner results understandable and actionable for business professionals who may not have strong technical backgrounds. This enables better decision-making and execution, filling the critical gap between technical security tools and business needs.

## Our Philosophy

### Leverage, Don't Rebuild

Because NUCLEI's original codebase is extremely well designed, we don't rebuild it from scratch. Instead, we fully leverage its strengths:

- **Keep**: The scanning engine remains unchanged
- **Enhance**: Focus on the output layer and overall user experience
- **Extend**: Add business context and interpretation layers

### User Experience First

We prioritize user experience through:

- **Clear and intuitive UI** - Easy to understand even on smartphones
- **Business-oriented templates** - Scan results explained in business language
- **Progressive disclosure** - High-level insights first, technical details on demand
- **Actionable outputs** - Every finding includes guidance on what to do next

## The Value Proposition

**We convert technical security value into business value without diminishing the underlying technical rigor.**

This project bridges the gap between security engineering excellence and business decision-making, ensuring that organizations can act on security findings effectively, regardless of their technical expertise.
