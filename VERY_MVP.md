# Very MVP - 3 Hour Core Implementation

## Purpose

After reviewing PR #9, we identified that the full MVP is too complex for rapid prototyping. This document defines the **absolute minimum** "very core" features that can be implemented in **3 hours** to validate the core value proposition.

## Core Value Proposition

**Transform a single NUCLEI scan result into business-friendly language.**

That's it. Nothing more.

## What's IN SCOPE (Very Core)

### 1. Single-Page CLI Tool (1 hour)
- Simple Node.js CLI script
- Takes a domain as input
- Executes NUCLEI synchronously (no queue, no workers)
- Parses JSON output
- Prints results to console

**Implementation:**
```bash
node scan.js example.com
```

### 2. Basic Translation Engine (1.5 hours)
- Simple function that takes NUCLEI JSON
- Returns business-translated findings
- Focus on 5 common vulnerability types only:
  - **RCE (Remote Code Execution)** - Server compromise risks
  - **SQL Injection** - Database breach and data theft
  - **XSS (Cross-Site Scripting)** - User session hijacking
  - **Exposed credentials** - Unauthorized access risks
  - **TLS issues** - Data interception vulnerabilities

**Translation Logic:**
- Map severity to priority (critical → immediate, etc.)
- Hardcoded business descriptions for each type
- Simple risk categorization (financial/governance/operational)
- One action per finding

### 3. Simple Console Output (0.5 hours)
- Formatted console output with colors
- Show business description first
- Show technical details below
- Priority-based sorting

**Output Example:**
```
🔴 CRITICAL - Operational Risk
Server compromise possible. Attackers could take full control.
Action: Apply security patch immediately (IT Operations, 24 hours)
Technical: RCE vulnerability in Apache Struts (CVE-2023-12345)
---
```

## What's OUT OF SCOPE (Deferred)

### Not in 3-Hour Version:
- ❌ No web UI (console only)
- ❌ No database (no persistence)
- ❌ No API endpoints
- ❌ No async processing / job queues
- ❌ No Docker
- ❌ No frontend framework
- ❌ No executive dashboard
- ❌ No historical tracking
- ❌ No scan management
- ❌ No error handling beyond basic try-catch
- ❌ No input validation (assume valid domain)
- ❌ No comprehensive translation (only 5 types)

## File Structure (Minimal)

```
domain-scanner-cli/
├── package.json           # Minimal deps: commander, chalk
├── scan.js                # Main CLI script (~150 lines)
├── translate.js           # Translation logic (~100 lines)
├── README_VERY_MVP.md     # Usage instructions
└── .gitignore
```

**Total files:** 4
**Total lines of code:** ~250-300

## Dependencies (Minimal)

```json
{
  "name": "domain-scanner-cli",
  "version": "1.0.0",
  "description": "Minimal CLI tool for NUCLEI scan translation",
  "dependencies": {
    "commander": "^11.0.0",    // CLI argument parsing
    "chalk": "^4.1.2"          // Console colors
  }
}
```

**No TypeScript, no build step, pure JavaScript.**

## Hardware & Software Dependencies

### Required Software
- **Node.js**: v16 or higher
- **NUCLEI**: Latest version installed and available in PATH
  - Install: `GO111MODULE=on go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest`
  - Or download binary from [Nuclei Releases](https://github.com/projectdiscovery/nuclei/releases)
- **npm**: For installing Node.js dependencies

### Hardware Requirements (Minimal)
- **CPU**: Any modern processor (single core sufficient)
- **RAM**: 512MB minimum (for Node.js and NUCLEI)
- **Disk**: 200MB for NUCLEI templates + dependencies
- **Network**: Basic internet connectivity for scanning external domains

### Network Dependencies
- **Outbound ports**: HTTP (80), HTTPS (443) for domain scanning
- **DNS resolution**: Required for domain lookup
- **NUCLEI template updates**: Requires GitHub access for template downloads

### Operating System
- **Linux**: Fully supported ✅
- **macOS**: Fully supported ✅
- **Windows**: Supported with WSL or native Node.js ✅

### Minimal Test Ecosystem
No infrastructure required:
- ✅ No database server
- ✅ No message queue
- ✅ No Docker daemon
- ✅ No reverse proxy
- ✅ No cloud services
- ✅ Single process execution

**Perfect for rapid validation with minimal setup overhead.**

## Implementation Plan (3 Hours)

### Hour 1: Basic NUCLEI Integration (0:00 - 1:00)
- [ ] **0:00-0:10** Create package.json with minimal dependencies
- [ ] **0:10-0:20** Create scan.js skeleton with CLI interface using commander
- [ ] **0:20-0:45** Implement NUCLEI execution using child_process.execSync
  - Execute: `nuclei -target <domain> -json -silent`
  - Capture stdout as JSON
  - Handle basic errors (NUCLEI not found, invalid domain)
- [ ] **0:45-0:55** Parse NUCLEI JSON output into JavaScript objects
- [ ] **0:55-1:00** Quick test with scanme.nmap.org

**Deliverable:** Working CLI that executes NUCLEI and captures JSON output

### Hour 2: Translation Engine (1:00 - 2:30)
- [ ] **1:00-1:15** Create translate.js with core translation function
- [ ] **1:15-1:30** Implement risk type classification logic
  - Map finding types to financial/governance/operational risks
- [ ] **1:30-1:45** Implement priority mapping (severity → business priority)
  - critical/high → Immediate
  - medium → This week
  - low → This month
- [ ] **1:45-2:15** Create business descriptions for 5 vulnerability types:
  - **RCE**: "Server takeover possible. Complete system compromise risk."
  - **SQLi**: "Database breach risk. Customer data could be stolen."
  - **XSS**: "User account hijacking possible. Session theft risk."
  - **Exposed credentials**: "Unauthorized access. Attackers have login details."
  - **TLS issues**: "Encrypted traffic vulnerable. Man-in-middle attacks possible."
- [ ] **2:15-2:30** Generate action items with timeframe and owner
  - Critical: "Apply patch immediately (IT Ops, 24h)"
  - High: "Schedule fix this week (Dev Team, 7 days)"
  - Medium: "Plan remediation (Security Team, 30 days)"

**Deliverable:** Translation engine that converts NUCLEI JSON to business language

### Hour 3: Output & Polish (2:30 - 3:00)
- [ ] **2:30-2:40** Format console output with chalk for colored text
  - 🔴 Red for Critical
  - 🟠 Orange for High
  - 🟡 Yellow for Medium
  - 🟢 Green for Low
- [ ] **2:40-2:50** Implement priority-based sorting of findings
- [ ] **2:50-2:55** Add summary statistics (total findings, by severity)
- [ ] **2:55-3:00** Create README_VERY_MVP.md with usage examples

**Deliverable:** Polished CLI tool with readable, colored output

## Code Structure Examples

### scan.js (Main CLI Script)
```javascript
#!/usr/bin/env node
const { program } = require('commander');
const { execSync } = require('child_process');
const { translateFindings, formatOutput } = require('./translate');
const chalk = require('chalk');

program
  .argument('<domain>', 'Domain to scan')
  .description('Scan a domain and translate findings to business language')
  .action((domain) => {
    console.log(chalk.blue(`Scanning ${domain}...`));
    
    try {
      // Execute NUCLEI synchronously
      const output = execSync(`nuclei -target ${domain} -json -silent`, {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024
      });
      
      // Parse JSON lines
      const findings = output.split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));
      
      // Translate to business language
      const translated = translateFindings(findings);
      
      // Output formatted results
      formatOutput(translated);
      
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program.parse();
```

### translate.js (Translation Logic)
```javascript
const chalk = require('chalk');

// Map vulnerability types to business descriptions
const BUSINESS_TRANSLATIONS = {
  'rce': {
    risk: 'Operational',
    impact: 'Server compromise possible. Complete control by attackers.',
    action: 'Apply security patch immediately',
    owner: 'IT Operations',
    timeframe: '24 hours'
  },
  'sqli': {
    risk: 'Financial',
    impact: 'Database breach. Customer data theft possible.',
    action: 'Fix database query handling',
    owner: 'Development Team',
    timeframe: '48 hours'
  },
  'xss': {
    risk: 'Governance',
    impact: 'User session hijacking. Account takeover possible.',
    action: 'Sanitize user inputs',
    owner: 'Development Team',
    timeframe: '1 week'
  },
  'exposed-credentials': {
    risk: 'Financial',
    impact: 'Unauthorized access. Login credentials exposed.',
    action: 'Rotate credentials immediately',
    owner: 'Security Team',
    timeframe: '4 hours'
  },
  'tls': {
    risk: 'Governance',
    impact: 'Data interception possible. Encryption weak.',
    action: 'Update TLS configuration',
    owner: 'IT Operations',
    timeframe: '1 week'
  }
};

// Map NUCLEI severity to business priority
const PRIORITY_MAP = {
  'critical': { level: 'CRITICAL', color: chalk.red, icon: '🔴' },
  'high': { level: 'HIGH', color: chalk.hex('#FFA500'), icon: '🟠' },
  'medium': { level: 'MEDIUM', color: chalk.yellow, icon: '🟡' },
  'low': { level: 'LOW', color: chalk.green, icon: '🟢' }
};

function getDefaultTranslation() {
  return {
    risk: 'Operational',
    impact: 'Security issue detected. Review required.',
    action: 'Investigate and assess impact',
    owner: 'Security Team',
    timeframe: '1 week'
  };
}

function translateFindings(findings) {
  return findings.map(finding => {
    const type = detectType(finding);
    const translation = BUSINESS_TRANSLATIONS[type] || getDefaultTranslation();
    const priority = PRIORITY_MAP[finding.severity] || PRIORITY_MAP['low'];
    
    return {
      ...finding,
      businessRisk: translation.risk,
      businessImpact: translation.impact,
      action: translation.action,
      owner: translation.owner,
      timeframe: translation.timeframe,
      priority: priority
    };
  });
}

function detectType(finding) {
  const name = finding.info?.name?.toLowerCase() || '';
  const tags = finding.info?.tags || [];
  
  if (tags.includes('rce') || name.includes('remote code')) return 'rce';
  if (tags.includes('sqli') || name.includes('sql injection')) return 'sqli';
  if (tags.includes('xss') || name.includes('cross-site')) return 'xss';
  if (name.includes('credential') || name.includes('password')) return 'exposed-credentials';
  if (name.includes('tls') || name.includes('ssl')) return 'tls';
  
  return 'unknown';
}

function formatOutput(findings) {
  // Sort by priority
  const sorted = findings.sort((a, b) => {
    const order = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
    return order[a.priority.level] - order[b.priority.level];
  });
  
  console.log(chalk.bold('\n=== SCAN RESULTS ===\n'));
  console.log(`Total findings: ${findings.length}\n`);
  
  sorted.forEach((finding, i) => {
    const p = finding.priority;
    console.log(p.color(`${p.icon} ${p.level} - ${finding.businessRisk} Risk`));
    console.log(chalk.bold(finding.businessImpact));
    console.log(`Action: ${finding.action} (${finding.owner}, ${finding.timeframe})`);
    console.log(chalk.gray(`Technical: ${finding.info?.name}`));
    console.log(chalk.gray(`URL: ${finding.matched_at || finding.host}`));
    console.log('---\n');
  });
}

module.exports = { translateFindings, formatOutput };
```

## Usage (Target)

```bash
# Install dependencies
npm install

# Run scan
node scan.js example.com

# Sample Output:
# Scanning example.com...
# 
# === SCAN RESULTS ===
# 
# Total findings: 3
# 
# 🔴 CRITICAL - Operational Risk
# Server compromise possible. Complete control by attackers.
# Action: Apply security patch immediately (IT Operations, 24 hours)
# Technical: Apache Struts RCE (CVE-2023-12345)
# URL: https://example.com
# ---
# 
# 🟠 HIGH - Financial Risk
# Database breach. Customer data theft possible.
# Action: Fix database query handling (Development Team, 48 hours)
# Technical: SQL Injection in login form
# URL: https://example.com/login
# ---
```

## Success Criteria

After 3 hours, we should have:
1. ✅ Working CLI that scans a domain using NUCLEI
2. ✅ Translates findings to business language for 5 vulnerability types
3. ✅ Readable, colored console output
4. ✅ Priority-based sorting
5. ✅ Validates the core concept

**If we can demo this in 3 hours, the concept is validated.**

## What We Learn

This very MVP will tell us:
- Does the translation make sense to non-technical users?
- Is the business language actually helpful?
- What translation patterns are most valuable?
- Is NUCLEI integration feasible?
- Can we deliver value with minimal infrastructure?

## Migration Path to Full MVP

Once validated, we can add:
- **Week 1:** Web UI (single HTML page, no framework)
- **Week 2:** Simple API (Express, in-memory storage)
- **Week 3:** Database persistence (PostgreSQL)
- **Week 4:** Async processing (Bull + Redis)
- **Week 5:** Dashboard & polish (React components)
- **Week 6:** Docker deployment
- **Week 7:** User management & authentication

## Comparison: Very MVP vs Full MVP

> **Note:** "Full MVP" refers to the complete web application delivered in PR #9, which includes React frontend, Express backend, PostgreSQL database, and Docker deployment.

| Feature | Very MVP (3h) | Full MVP (Complete Web App) |
|---------|--------------|------------------|
| **Interface** | CLI | Web UI (React) |
| **Translation** | 5 types | Comprehensive engine |
| **Storage** | None | PostgreSQL |
| **Processing** | Synchronous | Async (Bull/Redis) |
| **Deployment** | Local only | Docker Compose |
| **Code** | ~300 lines | ~3000+ lines |
| **Files** | 4 | 39 |
| **Dependencies** | 2 packages | 35+ packages |
| **Time to build** | 3 hours | 2-3 days |
| **Infrastructure** | None | DB + Queue + Docker |
| **Users** | Single | Multiple concurrent |
| **Use case** | Concept validation | Production pilot |

## Decision Framework

**Choose Very MVP (3 hours) if:**
- ✅ Need to validate concept quickly
- ✅ Want minimal infrastructure
- ✅ Prefer CLI interface
- ✅ Testing translation logic
- ✅ Proof-of-concept demo
- ✅ Learning/experimentation
- ✅ Single-user usage
- ✅ No persistence needed

**Choose Full MVP (PR #9) if:**
- ✅ Ready for real users
- ✅ Need web interface
- ✅ Want production features
- ✅ Multiple concurrent users
- ✅ Historical tracking needed
- ✅ Professional presentation required
- ✅ Team collaboration
- ✅ Long-term deployment

**Can have both:**
- ✅ Very MVP as CLI tool for quick scans
- ✅ Full MVP as web service for teams
- ✅ Different use cases for each

## Testing Strategy

### Manual Testing (No automated tests in 3-hour scope)

1. **Test with known vulnerable domain:**
   ```bash
   node scan.js scanme.nmap.org
   ```

2. **Verify output contains:**
   - Colored priority indicators
   - Business language descriptions
   - Action items with owners
   - Technical details

3. **Test edge cases:**
   - Domain with no findings
   - Invalid domain
   - NUCLEI not installed

4. **Validate with stakeholder:**
   - Show output to non-technical person
   - Ask: "Does this make sense?"
   - Iterate on language if needed

## Known Limitations

1. **No error recovery** - If NUCLEI fails, script exits
2. **Blocking execution** - Must wait for scan to complete
3. **No progress indicator** - Silent during scan
4. **Limited vulnerability coverage** - Only 5 types translated
5. **Hardcoded translations** - No customization
6. **No output formats** - Console only, no JSON/CSV export
7. **No scan history** - Results lost after display
8. **Single domain only** - No batch scanning
9. **No input validation** - Domain parameter passed directly to shell (acceptable for throwaway prototype, but production code should validate/sanitize inputs)

**These are acceptable trade-offs for 3-hour validation.**

## Next Steps After Implementation

### If concept validates successfully:
1. **Immediate** (Day 1-3): Get feedback from 5-10 stakeholders
2. **Week 1**: Refine translation language based on feedback
3. **Week 2**: Add more vulnerability types
4. **Week 3**: Consider migration to Full MVP architecture

### If concept needs iteration:
1. Identify which translations worked/didn't work
2. Refine business language
3. Test with different stakeholder groups
4. Repeat until value is clear

### If moving to production:
1. Deploy Full MVP from PR #9 (already complete)
2. Use this CLI tool for quick one-off scans
3. Web UI for team collaboration and history

## Documentation References

- **[MVP_IMPLEMENTATION.md](./MVP_IMPLEMENTATION.md)** - Full MVP technical details
- **Comparison framework** - See "Comparison: Very MVP vs Full MVP" section above
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - How to use Full MVP
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Full system architecture
- **[NUCLEI_LICENSE_ANALYSIS.md](./NUCLEI_LICENSE_ANALYSIS.md)** - Legal review

## Notes

- This is **throwaway code** - meant for validation only
- No tests, no error handling, no production concerns
- Focus on speed and learning
- Can be built by 1 developer in 1 sitting
- Perfect for demo to stakeholders
- **Zero infrastructure** means zero DevOps overhead
- **Pure JavaScript** means no build tooling needed

---

**Next Step:** Decide whether to implement Very MVP or proceed directly with Full MVP from PR #9.

**Status:** 
- Full MVP: ✅ Complete and production-ready
- Very MVP: 💡 Fully specified, ready to implement in 3 hours
