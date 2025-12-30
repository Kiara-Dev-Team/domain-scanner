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
- Focus on 3-5 common vulnerability types only:
  - RCE (Remote Code Execution)
  - SQL Injection
  - XSS (Cross-Site Scripting)
  - Exposed credentials
  - TLS issues

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
- ❌ No comprehensive translation (only 3-5 types)

## File Structure (Minimal)

```
domain-scanner/
├── package.json           # Minimal deps: commander, chalk
├── scan.js                # Main CLI script
├── translate.js           # Translation logic
├── README_VERY_MVP.md     # Usage instructions
└── .gitignore
```

**Total files:** 4
**Total lines of code:** ~250-300

## Dependencies (Minimal)

```json
{
  "dependencies": {
    "commander": "^11.0.0",    // CLI argument parsing
    "chalk": "^4.1.2"          // Console colors
  }
}
```

**No TypeScript, no build step, pure JavaScript.**

## Implementation Plan (3 Hours)

### Hour 1: Basic NUCLEI Integration
- [ ] Create package.json
- [ ] Create scan.js with CLI interface
- [ ] Implement NUCLEI execution (child_process)
- [ ] Parse JSON output
- [ ] Test with scanme.sh

### Hour 2: Translation Engine
- [ ] Create translate.js
- [ ] Implement risk type classification
- [ ] Implement priority mapping
- [ ] Create business descriptions for 5 types:
  - RCE
  - SQLi
  - XSS
  - Exposed credentials
  - TLS issues
- [ ] Generate actions

### Hour 3: Output & Polish
- [ ] Format console output with chalk
- [ ] Sort by priority
- [ ] Add summary statistics
- [ ] Test with real domains
- [ ] Write README_VERY_MVP.md

## Usage (Target)

```bash
# Install dependencies
npm install

# Run scan
node scan.js example.com

# Output shows:
# - Business summary
# - Sorted findings (business-first)
# - Technical details
```

## Success Criteria

After 3 hours, we should have:
1. ✅ Working CLI that scans a domain
2. ✅ Translates NUCLEI results to business language
3. ✅ Readable console output
4. ✅ Validates the core concept

**If we can demo this in 3 hours, the concept is validated.**

## What We Learn

This very MVP will tell us:
- Does the translation make sense to non-technical users?
- Is the business language actually helpful?
- What translation patterns are most valuable?
- Is NUCLEI integration feasible?

## Migration Path to Full MVP

Once validated, we can add:
- **Week 1:** Web UI (single HTML page, no framework)
- **Week 2:** Simple API (Express, in-memory storage)
- **Week 3:** Database persistence
- **Week 4:** Async processing
- **Week 5:** Dashboard & polish

## Comparison: Very MVP vs Full MVP

> **Note:** "Full MVP" refers to the complete web application delivered in PR #9, which includes React frontend, Express backend, PostgreSQL database, and Docker deployment.

| Feature | Very MVP (3h) | Full MVP (Complete Web App) |
|---------|--------------|------------------|
| Interface | CLI | Web UI |
| Translation | 5 types | Comprehensive |
| Storage | None | PostgreSQL |
| Processing | Sync | Async (Bull/Redis) |
| Deployment | Local | Docker Compose |
| Code | ~300 lines | ~3000+ lines |
| Files | 4 | 39 |
| Time to build | 3 hours | 2-3 days |

## Decision

**For rapid validation:** Use Very MVP
**For production pilot:** Use Full MVP (PR #9)

This Very MVP exists to answer one question: 
**"Does translating security findings to business language provide value?"**

If the answer is yes → build Full MVP
If the answer is no → pivot or abandon

## Notes

- This is throwaway code - meant for validation only
- No tests, no error handling, no production concerns
- Focus on speed and learning
- Can be built by 1 developer in 1 sitting
- Perfect for demo to stakeholders

---

**Next Step:** Decide whether to implement Very MVP or proceed with Full MVP from PR #9.

The Full MVP is already complete and ready. Very MVP would be built from scratch as a separate proof-of-concept.
