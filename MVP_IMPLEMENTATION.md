# MVP Implementation Documentation

This document describes the MVP (Minimum Viable Product) implementation of the Domain Scanner.

## Overview

The MVP implementation delivers the core value proposition: transforming technical security scan results (from NUCLEI) into actionable business intelligence that non-technical decision makers can understand and act upon.

## What's Included in MVP

### ✅ Core Features Implemented

1. **NUCLEI Integration Layer**
   - Executes NUCLEI scans via CLI
   - Parses JSON output
   - Handles scan lifecycle (pending → running → completed/failed)
   - Error handling and timeout management

2. **Business Translation Engine**
   - Classifies findings into risk types:
     - 💰 Financial Risk
     - ⚖️ Governance/Compliance Risk
     - ⚙️ Operational Risk
   - Translates technical findings to business language
   - Assigns business priority (Critical, High, Medium, Low)
   - Generates actionable recommendations with:
     - What to do
     - Who should do it
     - When to do it (timeframe)
     - How complex it is

3. **Web Dashboard (React + TypeScript)**
   - Executive summary with visual risk indicators
   - Risk posture overview
   - Priority-based finding breakdown
   - Risk type categorization
   - Recent scans list with status tracking

4. **Finding Details**
   - Business-first presentation
   - Progressive disclosure of technical details
   - Action guidance with ownership and timeline
   - Business impact explanation
   - Collapsible technical details section

5. **RESTful API**
   - `POST /api/scans` - Create and queue new scan
   - `GET /api/scans` - List all scans
   - `GET /api/scans/:id` - Get scan details
   - `GET /api/scans/:id/results` - Get scan results with findings

6. **Data Persistence**
   - PostgreSQL database for scans and findings
   - Redis for job queue
   - Proper indexing for performance

7. **Responsive Design**
   - Mobile-first design with TailwindCSS
   - Works on phones, tablets, and desktops
   - Touch-friendly interface

## Technology Stack

### Backend
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **Queue**: Bull (Redis-based)
- **NUCLEI**: External CLI dependency

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Router**: React Router v6
- **HTTP Client**: Axios
- **Date Utilities**: date-fns

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database Migrations**: Auto-created on startup

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Web Browser                    │
│            (React SPA - Port 3000)              │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│              RESTful API (Express)              │
│                  Port 3001                       │
└─────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐  ┌──────────┐  ┌──────────────┐
│  PostgreSQL  │  │  Redis   │  │    NUCLEI    │
│   Database   │  │  Queue   │  │ (External)   │
└──────────────┘  └──────────┘  └──────────────┘
```

## Project Structure

```
domain-scanner/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration
│   │   ├── models/           # Data models & database
│   │   ├── services/         # Business logic
│   │   │   ├── nuclei.service.ts      # NUCLEI integration
│   │   │   ├── translation.service.ts # Business translation
│   │   │   └── scan.service.ts        # Scan management
│   │   ├── controllers/      # HTTP controllers
│   │   ├── routes/           # API routes
│   │   └── server.ts         # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ExecutiveSummary.tsx
│   │   │   ├── FindingCard.tsx
│   │   │   ├── PriorityBadge.tsx
│   │   │   └── RiskTypeIcon.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── NewScan.tsx
│   │   │   └── ScanResults.tsx
│   │   ├── services/         # API client
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx           # App root
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml        # Docker orchestration
├── package.json              # Root package for dev commands
└── README.md                 # Documentation
```

## Key Design Decisions

### 1. Business-First Translation

Every NUCLEI finding is automatically translated to business context:

**Technical Finding:**
```json
{
  "template-id": "CVE-2023-12345",
  "info": {
    "name": "Apache Struts RCE",
    "severity": "critical"
  }
}
```

**Business Finding:**
```json
{
  "riskType": "OPERATIONAL",
  "priority": "IMMEDIATE",
  "businessDescription": "Server compromise possible. Attackers could take full control...",
  "businessImpact": [
    "Service availability could be affected",
    "System compromise possible",
    "Business continuity at risk"
  ],
  "actions": [
    {
      "description": "Apply security patch immediately",
      "owner": "IT Operations",
      "timeframe": "24 hours",
      "complexity": "MEDIUM"
    }
  ]
}
```

### 2. Progressive Disclosure

UI shows business information first, technical details on demand:

1. **Level 1 (Default)**: Business description, impact, actions
2. **Level 2 (Click to expand)**: Technical details (CVE, severity, etc.)

This ensures non-technical users aren't overwhelmed while technical users can access details when needed.

### 3. Mobile-First Responsive Design

- Cards-based layout works on any screen size
- Touch-friendly buttons and interactions
- Readable text at all sizes
- Progressive enhancement for larger screens

### 4. Asynchronous Scanning

Scans run in background workers via Bull/Redis:
- API responds immediately with scan ID
- Frontend polls for updates
- No timeout issues for long scans
- Scalable to multiple concurrent scans

## Translation Engine Logic

### Risk Type Classification

```typescript
// Financial Risk: Payment, transaction, revenue-related
if (tags.includes('payment') || name.includes('payment')) 
  → FINANCIAL

// Governance Risk: Compliance, encryption, data protection
if (tags.includes('tls') || name.includes('encryption')) 
  → GOVERNANCE

// Operational Risk: Service availability, system integrity
else 
  → OPERATIONAL
```

### Priority Determination

```typescript
// Immediate: Critical severity or dangerous attack vectors
if (severity === 'critical' || tags.includes('rce')) 
  → IMMEDIATE

// High: High severity findings
if (severity === 'high') 
  → HIGH

// Medium: Medium severity
if (severity === 'medium') 
  → MEDIUM

// Low: Everything else
else 
  → LOW
```

### Business Description Generation

The engine recognizes common vulnerability patterns and translates them:

| Technical Term | Business Translation |
|----------------|---------------------|
| RCE (Remote Code Execution) | "Server compromise possible. Attackers could take full control..." |
| SQL Injection | "Database breach risk detected. Sensitive data could be accessed..." |
| XSS (Cross-Site Scripting) | "User account takeover risk. Attackers could impersonate users..." |
| Exposed .git directory | "Source code exposure detected. Reveals application logic..." |
| Outdated TLS | "Outdated encryption detected. Customer data transmission at risk..." |

## User Flows

### 1. First-Time User Journey

```
1. Land on Dashboard → See empty state with "Start New Scan" CTA
2. Click "Start New Scan"
3. Enter domain (e.g., example.com)
4. Click "Start Scan"
5. Redirected to scan page → See "Scan in Progress" message
6. Wait (auto-refreshes every 5 seconds)
7. Scan completes → See Executive Summary
8. Scroll down → See findings with business context
9. Click finding → Expand to see technical details
10. Understand what to do next from action guidance
```

### 2. Regular User Journey

```
1. Land on Dashboard → See recent scans
2. Click completed scan → View results
3. Use priority filters to focus on critical issues
4. Review findings and action guidance
5. Navigate back to run another scan
```

## API Examples

### Create Scan

```bash
POST /api/scans
Content-Type: application/json

{
  "targetDomain": "example.com"
}

Response:
{
  "message": "Scan created and queued",
  "scan": {
    "id": "uuid",
    "targetDomain": "example.com",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get Scan Results

```bash
GET /api/scans/{id}/results

Response:
{
  "scan": { ... },
  "findings": [ ... ],
  "summary": {
    "immediate": 1,
    "high": 3,
    "medium": 5,
    "low": 2,
    "byRiskType": {
      "financial": 2,
      "governance": 4,
      "operational": 5
    }
  }
}
```

## Limitations (MVP)

The following features are **NOT** included in MVP:

- ❌ User authentication/authorization
- ❌ Multi-tenant support
- ❌ Historical trend analysis
- ❌ Scheduled/recurring scans
- ❌ PDF/HTML report generation
- ❌ Email notifications
- ❌ Advanced filtering and search
- ❌ Custom risk frameworks
- ❌ Third-party integrations
- ❌ API rate limiting
- ❌ Advanced analytics

These will be added in subsequent phases (see [DEV_SCOPE.md](./DEV_SCOPE.md)).

## Testing the MVP

### 1. Test with Mock Target

Use NUCLEI's test domain:
```bash
# In the UI, scan: scanme.sh
```

### 2. Test Locally

```bash
# Start services
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Test API directly
curl http://localhost:3001/health
curl -X POST http://localhost:3001/api/scans \
  -H "Content-Type: application/json" \
  -d '{"targetDomain":"example.com"}'
```

### 3. Test UI

1. Open http://localhost:3000
2. Start a scan
3. Verify:
   - Scan status updates
   - Executive summary appears
   - Findings are shown with business context
   - Technical details can be expanded
   - Mobile view works

## Environment Variables

```bash
# Backend (.env)
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://scanner:scanner123@localhost:5432/domain_scanner
REDIS_URL=redis://localhost:6379
NUCLEI_PATH=nuclei
SCAN_TIMEOUT=300000
MAX_CONCURRENT_SCANS=5
```

## Database Schema

### Scans Table
```sql
CREATE TABLE scans (
  id UUID PRIMARY KEY,
  target_domain VARCHAR(255),
  status VARCHAR(50),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  error TEXT,
  findings_count INTEGER,
  created_at TIMESTAMP
);
```

### Findings Table
```sql
CREATE TABLE findings (
  id UUID PRIMARY KEY,
  scan_id UUID REFERENCES scans(id),
  risk_type VARCHAR(50),
  priority VARCHAR(50),
  business_description TEXT,
  business_impact JSONB,
  actions JSONB,
  technical JSONB,
  created_at TIMESTAMP
);
```

## Performance Considerations

### MVP Performance Targets
- Scan processing: 1-5 minutes (depends on NUCLEI)
- API response time: < 1 second
- Translation processing: < 1 second per finding
- UI load time: < 2 seconds

### Scalability (MVP)
- Supports 5 concurrent scans (configurable)
- Single server deployment
- No horizontal scaling (yet)

## Security Considerations

### MVP Security Features
- Input validation on domain names
- SQL injection protection (parameterized queries)
- CORS configuration
- Error messages don't leak sensitive info

### MVP Security Limitations
- ❌ No authentication (anyone can use it)
- ❌ No rate limiting
- ❌ No scan authorization checks
- ❌ No encrypted connections (use HTTPS in production)

## Deployment

### Development
```bash
docker-compose up -d
```

### Production (Simple)
```bash
# Set production environment
export NODE_ENV=production

# Use production database
export DATABASE_URL=your-prod-db-url

# Build and run
docker-compose -f docker-compose.prod.yml up -d
```

## Next Steps (Post-MVP)

See [DEV_SCOPE.md](./DEV_SCOPE.md) Phase 2 for planned features:

1. PDF/HTML report generation
2. User authentication
3. Scan scheduling
4. Historical tracking and trends
5. Email notifications
6. Advanced dashboard visualizations
7. API authentication and rate limiting

## Support

For MVP-related questions:
- Check [README.md](./README.md) for setup instructions
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- See [UX_PRINCIPLES.md](./UX_PRINCIPLES.md) for design rationale

---

**MVP Status**: ✅ Complete and Ready for Testing

**Next Milestone**: Phase 2 - Core Features (see [DEV_SCOPE.md](./DEV_SCOPE.md))
