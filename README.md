# domain-scanner
We make domain safety scanning easy, and strategy making easy.

<img src="https://github.com/user-attachments/assets/8ac0a62a-d182-4800-a641-328b82f518ef" alt="Golden padlock and key illustration representing domain security" style="max-width: 100%; height: auto;">

## About

This project uses vulnerability scanning technologies to help identify and analyze domain security issues.

## Legal & Licensing

- **This Project License:** MIT License (see [LICENSE](LICENSE))
- **Third-Party Dependencies:** See [NOTICES.md](NOTICES.md) for attribution
- **Nuclei License Analysis:** See [NUCLEI_LICENSE_ANALYSIS.md](NUCLEI_LICENSE_ANALYSIS.md) for detailed legal review

### Using Nuclei

This project may integrate with [ProjectDiscovery's Nuclei](https://github.com/projectdiscovery/nuclei), a vulnerability scanner licensed under the MIT License. Our legal analysis confirms:
- ✅ Safe for commercial and open-source use
- ✅ Compatible with our MIT License
- ✅ Low legal risk with proper attribution
- ✅ No licensing fees required

See [NUCLEI_LICENSE_ANALYSIS.md](NUCLEI_LICENSE_ANALYSIS.md) for complete legal analysis and risk assessment. 
# Domain Scanner

> Security scanning results that business leaders can actually understand and act on.

## What is Domain Scanner?

Domain Scanner transforms technical security scan results into actionable business intelligence. Built on top of [NUCLEI](https://github.com/projectdiscovery/nuclei), we bridge the gap between security tools and business decision-making.

**For Business Leaders:** Understand your security risks in plain English, with clear guidance on what to do next.

**For Security Teams:** Leverage NUCLEI's powerful scanning with automatic translation to business impact.

## The Problem We Solve

Traditional security scanners output technical jargon that business decision makers can't act on:
- ❌ "CVE-2023-12345: RCE vulnerability detected, CVSS 8.5"
- ❌ Raw technical reports requiring security expertise
- ❌ No guidance on business impact or next actions

## Our Solution

We translate technical findings into business language with clear action plans:
- ✅ "**Operational Risk**: Server compromise possible. Service disruption likely. Priority: Immediate. Action: Apply security patch within 24 hours."
- ✅ Business-friendly reports for executives and decision makers
- ✅ Clear guidance on what to do, who should do it, and when

## Key Features

- 🎯 **Business-First Interface** - Designed for non-technical decision makers
- 💼 **Risk Translation** - Converts technical findings to business impact (Financial, Governance, Operational)
- 📋 **Action Guidance** - Every finding includes clear next steps and ownership
- 📊 **Executive Dashboard** - High-level overview with trends and priorities
- 📱 **Mobile Responsive** - Access insights anywhere, on any device
- 🔍 **Progressive Disclosure** - Business view by default, technical details on demand
- 🤖 **Powered by NUCLEI** - Leverages industry-leading open-source scanner

## Documentation

Comprehensive documentation to understand our vision, scope, and design:

- **[DOCS_OVERVIEW.md](./DOCS_OVERVIEW.md)** - 📚 Documentation guide and reading paths
- **[WHY.md](./WHY.md)** - Background and rationale for the project
- **[WHAT.md](./WHAT.md)** - Product concept and differentiation strategy
- **[DEV_SCOPE.md](./DEV_SCOPE.md)** - Development scope and technical boundaries
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design
- **[UX_PRINCIPLES.md](./UX_PRINCIPLES.md)** - UI/UX design principles and experience definition

## Quick Start

> **Note:** Domain Scanner is currently under active development. This section will be updated with installation and usage instructions as the project progresses.

### Prerequisites

- [NUCLEI](https://github.com/projectdiscovery/nuclei) installed
- Docker and Docker Compose (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/Kiara-Dev-Team/domain-scanner.git
cd domain-scanner

# More instructions coming soon
```

## Use Cases

- **Executive Risk Review** - Quick security posture assessment for leadership
- **Pre-Investment Due Diligence** - Evaluate target company security for M&A decisions
- **Board Reporting** - Generate quarterly security reports with business context
- **Operational Risk Management** - Monitor external attack surface continuously
- **Vendor Security Assessment** - Evaluate third-party security in business terms

## Roadmap

### Phase 1: MVP (Current)
- [ ] NUCLEI integration
- [ ] Basic business translation engine
- [ ] Simple web dashboard
- [ ] PDF/HTML reporting

### Phase 2: Core Features
- [ ] Advanced translation engine
- [ ] Scan scheduling
- [ ] Historical tracking
- [ ] Mobile-responsive UI
- [ ] API for integrations

### Phase 3: Enterprise Features
- [ ] Multi-tenant support
- [ ] Role-based access control
- [ ] Advanced analytics
- [ ] Third-party integrations

See [DEV_SCOPE.md](./DEV_SCOPE.md) for detailed development phases.

## Technology Stack

**Foundation:**
- [NUCLEI](https://github.com/projectdiscovery/nuclei) - Security scanning engine

**Backend (Planned):**
- Language: Go / Python / Node.js (TypeScript) - TBD
- Database: PostgreSQL
- Cache: Redis
- Queue: Redis + Bull / Celery

**Frontend (Planned):**
- Framework: React + TypeScript
- UI Library: TailwindCSS + shadcn/ui
- Visualization: Recharts + D3.js

See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete technical architecture.

## Contributing

We welcome contributions! Please see our contributing guidelines (coming soon).

### Development Principles

1. **Business value first** - Every feature must serve business decision makers
2. **Leverage NUCLEI** - Don't rebuild the scanner, enhance the output
3. **Clear over clever** - Simple, understandable code and UX
4. **User-centric design** - Design for non-technical users by default
5. **Progressive disclosure** - Show high-level first, details on demand

## Target Users

**Primary:** Business decision makers (executives, product owners, risk managers, operations leaders)

**Secondary:** Security teams needing to communicate with business stakeholders

**Not for:** Security researchers, penetration testers (they should use NUCLEI directly)

## Differentiation

| Aspect | Traditional Scanners | Domain Scanner |
|--------|---------------------|----------------|
| **Primary User** | Security engineers | Business decision makers |
| **Output Language** | Technical jargon | Business language |
| **After Detection** | Lists vulnerabilities | Provides action plan |
| **Risk Framing** | CVSS scores | Business impact |
| **UI/UX** | Tool-centric | User-outcome-centric |

## Philosophy

**We convert technical security value into business value without diminishing the underlying technical rigor.**

- We don't replace security tools - we make them accessible to business users
- We don't simplify security - we translate it to business impact
- We don't hide details - we present them progressively

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Support

- 📧 Email: support@kiara-dev.team (coming soon)
- 💬 Discussions: [GitHub Discussions](https://github.com/Kiara-Dev-Team/domain-scanner/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/Kiara-Dev-Team/domain-scanner/issues)

## Acknowledgments

Built on top of [NUCLEI](https://github.com/projectdiscovery/nuclei) by [ProjectDiscovery](https://projectdiscovery.io). We're grateful for their excellent open-source security tooling.

Header image: [Golden padlock and key illustration](https://unsplash.com/illustrations/a-golden-padlock-and-key-on-a-dark-background-OAdjlX3-qf8) from Unsplash.

---

**Status:** 🚧 Under Active Development

**Current Phase:** Planning & Architecture

**Looking for:** Contributors, feedback, early adopters 
