# Architecture

## System Architecture Overview

This document defines the technical architecture of the Domain Scanner platform.

## Architecture Principles

### Core Principles

1. **Separation of Concerns**: Clear boundaries between scanning, translation, and presentation
2. **Plugin Architecture**: Non-invasive integration with NUCLEI
3. **Scalability**: Design for growth from day one
4. **Maintainability**: Clean, documented, testable code
5. **Security**: No additional vulnerabilities introduced
6. **Simplicity**: Start simple, add complexity only when needed

### Design Philosophy

- **Build on NUCLEI, don't fork it**: NUCLEI is a dependency, not modified code
- **Business logic is our differentiator**: Focus development on translation and UX layers
- **Progressive enhancement**: Start with MVP, iterate based on feedback
- **Cloud-native when possible**: Design for cloud deployment but support on-premise

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Presentation Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web UI     │  │  Mobile UI   │  │   Reports    │      │
│  │  (Dashboard) │  │ (Responsive) │  │  (PDF/HTML)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         API Layer                            │
│  ┌──────────────────────────────────────────────────┐       │
│  │           RESTful API / GraphQL (TBD)            │       │
│  │  • Authentication  • Authorization  • Rate Limit │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                    │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  Translation   │  │  Recommendation│  │   Analytics  │  │
│  │    Engine      │  │     Engine     │  │    Engine    │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Integration Layer                       │
│  ┌────────────────────────────────────────────────┐         │
│  │           NUCLEI Integration Plugin            │         │
│  │  • Output Parser  • Config Manager  • Runner  │         │
│  └────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         NUCLEI Engine                        │
│                    (External Dependency)                     │
│              https://github.com/projectdiscovery/nuclei      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Target Domains                         │
└─────────────────────────────────────────────────────────────┘

                      Supporting Systems
┌─────────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Database   │  │    Cache     │  │  Job Queue   │      │
│  │  (Postgres)  │  │    (Redis)   │  │   (Redis)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Layer Details

### 1. Presentation Layer

**Responsibility**: User interface and visualization

#### Components

**Web Dashboard**
- Business risk overview
- Findings list with business context
- Progressive disclosure of technical details
- Responsive design for desktop and mobile

**Reporting Engine**
- PDF generation for executives
- HTML reports for sharing
- CSV export for analysis
- Customizable templates

**Mobile Interface**
- Responsive web design (mobile-first)
- Native apps (future consideration)
- Push notifications (future)

#### Technology Considerations

**Frontend Framework Options:**
- React + TypeScript (modern, popular, strong ecosystem)
- Vue.js + TypeScript (simpler learning curve)
- Svelte (performance, simplicity)

**UI Component Library:**
- Material-UI / shadcn/ui (React)
- Vuetify (Vue)
- TailwindCSS (utility-first, flexible)

**Visualization:**
- D3.js for custom visualizations
- Chart.js for standard charts
- Recharts (React-specific)

### 2. API Layer

**Responsibility**: External interface and request handling

#### RESTful API Design

**Core Endpoints:**

```
POST   /api/v1/scans              # Start new scan
GET    /api/v1/scans              # List scans
GET    /api/v1/scans/{id}         # Get scan details
GET    /api/v1/scans/{id}/report  # Get business report
GET    /api/v1/scans/{id}/raw     # Get technical details

GET    /api/v1/findings           # List all findings
GET    /api/v1/findings/{id}      # Get finding details

GET    /api/v1/analytics/trends   # Risk trends
GET    /api/v1/analytics/summary  # Executive summary

POST   /api/v1/config             # Update configuration
GET    /api/v1/config             # Get configuration
```

#### Security

- JWT-based authentication
- Role-based access control (RBAC)
- API rate limiting
- Request validation
- HTTPS only

#### Technology Considerations

**API Framework Options:**
- Express.js (Node.js) - Simple, flexible
- FastAPI (Python) - Modern, fast, auto-docs
- Go Gin/Echo - High performance
- NestJS (Node.js) - Enterprise-ready, structured

### 3. Business Logic Layer

**Responsibility**: Core value-add logic

#### Translation Engine

**Input**: NUCLEI scan results (JSON/YAML)
**Output**: Business-contextualized findings

**Components:**

1. **Parser**: Extract structured data from NUCLEI output
2. **Classifier**: Categorize findings (financial/governance/operational)
3. **Impact Analyzer**: Assess business impact
4. **Language Generator**: Create business descriptions
5. **Severity Mapper**: Map technical severity to business priority

**Process Flow:**

```
NUCLEI Result → Parse → Classify → Analyze Impact → 
Generate Description → Assign Priority → Business Finding
```

**Data Structure Example:**

```json
{
  "technical": {
    "id": "CVE-2023-12345",
    "severity": "HIGH",
    "cvss": 8.5,
    "description": "Remote Code Execution in Apache Struts"
  },
  "business": {
    "riskType": "OPERATIONAL",
    "impactAreas": ["availability", "integrity"],
    "businessDescription": "Server compromise possible. Service disruption likely.",
    "revenueImpact": "HIGH",
    "priority": "IMMEDIATE",
    "actions": [
      {
        "action": "Apply security patch",
        "owner": "IT_OPS",
        "timeframe": "24_HOURS",
        "complexity": "MEDIUM"
      }
    ]
  }
}
```

#### Recommendation Engine

**Responsibility**: Generate actionable recommendations

**Logic:**
- Vulnerability type → Standard remediation steps
- Severity + Impact → Priority assignment
- Technology stack → Appropriate owner
- Risk type → Communication template

#### Analytics Engine

**Responsibility**: Trend analysis and insights

**Features:**
- Historical trend tracking
- Baseline establishment
- Anomaly detection
- Risk score calculation
- Comparative analysis

### 4. Integration Layer

**Responsibility**: Interface with NUCLEI

#### NUCLEI Integration Plugin

**Components:**

1. **Configuration Manager**
   - Template selection
   - Scan parameters
   - Target specification

2. **Process Runner**
   - Execute NUCLEI scans
   - Handle subprocess management
   - Capture output

3. **Output Parser**
   - Parse JSON/YAML results
   - Extract metadata
   - Normalize data structure

4. **Error Handler**
   - Handle NUCLEI errors
   - Retry logic
   - Fallback mechanisms

**NUCLEI Execution Model:**

```
Domain Scanner                    NUCLEI
      │                             │
      ├─ Prepare Config ──────────→ │
      │                             │
      ├─ Execute Scan ──────────────→ Run
      │                             │
      │                         ← ─ JSON Output
      │                             │
      ├─ Parse Results              │
      │                             │
      └─ Business Translation       │
```

**Isolation Strategy:**
- NUCLEI runs in separate process/container
- Results captured via stdout/file
- No direct code coupling
- Version compatibility checking

### 5. Data Layer

**Responsibility**: Data persistence and retrieval

#### Database Schema (Conceptual)

**Core Entities:**

```
scans
- id (PK)
- target_domain
- status (pending/running/complete/failed)
- started_at
- completed_at
- created_by

findings
- id (PK)
- scan_id (FK)
- technical_data (JSONB)
- business_data (JSONB)
- risk_type
- severity
- priority

actions
- id (PK)
- finding_id (FK)
- action_type
- owner
- status (pending/in_progress/complete)
- due_date

reports
- id (PK)
- scan_id (FK)
- report_type
- format (pdf/html/csv)
- generated_at
- file_path

configurations
- id (PK)
- user_id (FK)
- settings (JSONB)
```

#### Technology Considerations

**Database Options:**
- PostgreSQL (preferred) - JSONB support, reliability, performance
- MySQL - Widely supported, familiar
- MongoDB - Schema flexibility (if needed)

**Caching:**
- Redis - Fast, simple, pub/sub support
- Memcached - Simple key-value (if Redis not needed)

**Job Queue:**
- Redis + Bull (Node.js)
- Celery (Python)
- RabbitMQ (if complex workflows needed)

### 6. Supporting Systems

#### Job Queue System

**Purpose**: Asynchronous scan execution

**Flow:**
```
User Request → API → Enqueue Job → Worker → Execute NUCLEI → 
Process Results → Store → Notify User
```

**Benefits:**
- Non-blocking API requests
- Scalable worker pools
- Retry capabilities
- Priority queues

#### Caching Layer

**Cache Strategy:**

- **Scan Results**: TTL-based (1 hour)
- **Static Content**: Long-lived (1 day+)
- **User Sessions**: Session-based
- **Analytics**: Computed cache (5 minutes)

#### Monitoring & Logging

**Observability Stack:**

- **Logging**: Structured logs (JSON format)
- **Metrics**: Response times, queue depth, scan duration
- **Tracing**: Distributed tracing (if microservices)
- **Alerting**: Critical errors, performance degradation

**Tools Consideration:**
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Prometheus + Grafana
- DataDog / New Relic (SaaS options)

## Deployment Architecture

### Cloud Deployment (Preferred)

```
┌─────────────────────────────────────────────┐
│                 Load Balancer               │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│   Web App    │        │   Web App    │
│  (Container) │        │  (Container) │
└──────────────┘        └──────────────┘
        │                       │
        └───────────┬───────────┘
                    ▼
        ┌───────────────────────┐
        │     API Gateway       │
        └───────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│ API Service  │        │    Worker    │
│  (Container) │        │   (Container)│
└──────────────┘        └──────────────┘
        │                       │
        └───────────┬───────────┘
                    ▼
        ┌───────────────────────┐
        │   Managed Services    │
        │  - Database (RDS)     │
        │  - Cache (ElastiCache)│
        │  - Queue (SQS)        │
        └───────────────────────┘
```

**Platform Options:**
- AWS (ECS/EKS, RDS, ElastiCache, S3)
- Google Cloud (GKE, Cloud SQL, Memorystore)
- Azure (AKS, Azure Database, Redis Cache)
- DigitalOcean (Droplets, Managed Database)

### Self-Hosted / On-Premise

**Docker Compose Deployment:**

```yaml
services:
  web:
    image: domain-scanner-web
    ports: ["80:80"]
  
  api:
    image: domain-scanner-api
    depends_on: [db, redis]
  
  worker:
    image: domain-scanner-worker
    depends_on: [db, redis, api]
  
  db:
    image: postgres:15
    volumes: ["postgres-data:/var/lib/postgresql/data"]
  
  redis:
    image: redis:7
    volumes: ["redis-data:/data"]
```

**Kubernetes Deployment:**
- Helm charts for easy deployment
- StatefulSets for database
- Deployments for stateless services
- Ingress for routing

## Data Flow

### Scan Execution Flow

```
1. User initiates scan via UI
   ↓
2. API validates request & creates scan record
   ↓
3. Job enqueued in Redis queue
   ↓
4. Worker picks up job
   ↓
5. Worker configures & executes NUCLEI
   ↓
6. NUCLEI scans target domain
   ↓
7. NUCLEI returns JSON results
   ↓
8. Worker parses results
   ↓
9. Translation Engine processes findings
   ↓
10. Business findings stored in DB
   ↓
11. Analytics engine updates trends
   ↓
12. User notified (if configured)
   ↓
13. User views results in UI
```

### Real-Time Updates (Optional)

**WebSocket/SSE for live scan status:**

```
UI ←──WebSocket──→ API ←──Redis Pub/Sub──→ Worker

User sees live updates as scan progresses
```

## Security Architecture

### Application Security

1. **Authentication**: JWT tokens, session management
2. **Authorization**: RBAC, resource-level permissions
3. **Input Validation**: All user inputs validated
4. **Output Encoding**: XSS prevention
5. **SQL Injection Prevention**: Parameterized queries
6. **CSRF Protection**: Token-based
7. **Rate Limiting**: API throttling

### Infrastructure Security

1. **Network**: VPC, security groups, firewalls
2. **Encryption**: TLS for transport, encryption at rest
3. **Secrets Management**: Vault, AWS Secrets Manager
4. **Least Privilege**: IAM roles, service accounts
5. **Audit Logging**: All security events logged

### NUCLEI Execution Security

1. **Isolation**: NUCLEI runs in separate container
2. **Resource Limits**: CPU/memory limits
3. **Network Isolation**: Controlled outbound access
4. **Non-Root Execution**: Run as non-privileged user

## Scalability Strategy

### Horizontal Scaling

- **API Services**: Stateless, scale with load
- **Workers**: Scale based on queue depth
- **Database**: Read replicas for queries
- **Cache**: Redis cluster for high availability

### Performance Optimization

- **Caching**: Aggressive caching of computed results
- **Async Processing**: All scans async
- **Database Indexing**: Optimized queries
- **CDN**: Static assets via CDN
- **Compression**: Response compression

### Capacity Planning

**Estimated Resource Requirements (per concurrent scan):**
- CPU: 0.5 cores
- Memory: 512MB
- Storage: 10MB (per scan result)
- Network: 100Mbps

**Scaling Targets:**
- Support 100 concurrent scans
- Process 1000+ scans per day
- Store 1 year of scan history
- API response time < 200ms
- Scan processing time: 1-5 minutes (depends on target)

## Technology Stack (Recommended)

### Backend
- **Language**: Go or Python or Node.js (TypeScript)
- **API Framework**: FastAPI (Python) / Gin (Go) / NestJS (Node.js)
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Queue**: Redis + Bull / Celery

### Frontend
- **Framework**: React 18+ with TypeScript
- **UI Library**: TailwindCSS + shadcn/ui
- **State Management**: React Query + Zustand
- **Visualization**: Recharts + D3.js

### DevOps
- **Containerization**: Docker
- **Orchestration**: Kubernetes (production) / Docker Compose (dev)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack or Loki

### Development Tools
- **Version Control**: Git
- **Code Quality**: ESLint, Prettier, SonarQube
- **Testing**: Jest, Pytest, Cypress
- **Documentation**: Swagger/OpenAPI

## Development Environment

### Local Development Setup

```bash
# Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for frontend)
- Python 3.11+ or Go 1.21+ (for backend)
- PostgreSQL 15+ (or via Docker)
- Redis 7+ (or via Docker)

# Quick Start
git clone https://github.com/Kiara-Dev-Team/domain-scanner
cd domain-scanner
docker-compose up -d  # Start dependencies
npm install           # Frontend dependencies
pip install -r requirements.txt  # Backend dependencies
npm run dev          # Start development servers
```

## Testing Strategy

### Test Pyramid

```
        ┌──────────────┐
        │   E2E Tests  │  10%
        └──────────────┘
      ┌──────────────────┐
      │ Integration Tests│  30%
      └──────────────────┘
    ┌──────────────────────┐
    │     Unit Tests       │  60%
    └──────────────────────┘
```

### Test Coverage Targets
- Unit Tests: 80%+ coverage
- Integration Tests: Critical paths
- E2E Tests: Key user journeys

## Migration Strategy

### Phase 1: MVP with Mock Data
- Build UI with static/mock data
- Validate UX with stakeholders
- No NUCLEI integration yet

### Phase 2: NUCLEI Integration
- Integrate NUCLEI for real scanning
- Validate translation accuracy
- Iterate on business logic

### Phase 3: Production Hardening
- Add authentication, authorization
- Implement monitoring, logging
- Performance optimization
- Security hardening

## Future Considerations

### Microservices (if needed at scale)
- Separate scanning, translation, and API services
- Independent scaling
- Technology diversity per service

### Machine Learning
- ML models for risk prediction
- Automated prioritization
- Anomaly detection

### Multi-Region Deployment
- Geographic distribution
- Data sovereignty compliance
- Reduced latency

## Architecture Decision Records (ADR)

Future architectural decisions will be documented as ADRs in `/docs/adr/` directory.

**Format:**
- **Title**: Brief decision title
- **Status**: Proposed / Accepted / Deprecated
- **Context**: Why this decision is needed
- **Decision**: What we decided
- **Consequences**: Trade-offs and implications

---

This architecture is designed to be **simple to start, easy to scale**.

Start with monolith, evolve to microservices if needed.
Focus on value delivery, not premature optimization.
