# Getting Started with Domain Scanner

Welcome! This guide will help you get the Domain Scanner MVP up and running.

## What is Domain Scanner?

Domain Scanner transforms technical security scan results into business-friendly intelligence that decision makers can understand and act on. Built on top of [NUCLEI](https://github.com/projectdiscovery/nuclei), we bridge the gap between security tools and business decision-making.

## Quick Start (5 minutes)

### Prerequisites

1. **Install NUCLEI** (the security scanner)
   ```bash
   # macOS
   brew install nuclei
   
   # Linux
   go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
   
   # Or download from: https://github.com/projectdiscovery/nuclei/releases
   ```

2. **Install Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop

3. **Verify installations**
   ```bash
   nuclei -version    # Should show version
   docker --version   # Should show version
   ```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Kiara-Dev-Team/domain-scanner.git
cd domain-scanner

# 2. Copy environment file
cp .env.example .env

# 3. Start all services
docker-compose up -d

# 4. Wait for services to start (about 30 seconds)
# Watch logs to see when ready:
docker-compose logs -f

# When you see "Server running on port 3001", you're ready!
```

### Access the Application

Open your browser to:
- **Web UI**: http://localhost:3000
- **API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

## Running Your First Scan

1. **Open the Web UI**: http://localhost:3000
2. **Click "Start New Scan"**
3. **Enter a domain**:
   - Use `scanme.sh` for testing (NUCLEI's test domain)
   - Or use `example.com`
   - Or your own domain (only if you own it!)
4. **Click "Start Scan"**
5. **Wait 1-5 minutes** for the scan to complete
6. **View Results** - You'll see:
   - Executive summary with risk indicators
   - Business-friendly finding descriptions
   - Actionable recommendations
   - Technical details (expandable)

## Understanding the Results

### Executive Summary

The top of your results shows your security posture:

- **🔴 Critical (Immediate)**: Fix within 24 hours
- **🟡 High Priority**: Fix this week
- **🔵 Medium**: Plan to address this month
- **⚪ Low**: Monitor and address as needed

### Risk Types

Findings are categorized by business impact:

- **💰 Financial Risk**: Affects revenue, transactions, payment processing
- **⚖️ Compliance Risk**: Regulatory violations, data privacy issues
- **⚙️ Operational Risk**: Service disruption, system availability

### Finding Details

Each finding shows:
1. **Business Description**: What we found in plain English
2. **Business Impact**: How it affects your organization
3. **Actions**: What to do, who should do it, when, and how complex
4. **Technical Details**: CVE, severity, etc. (click to expand)

## Stopping the Application

```bash
# Stop all services
docker-compose down

# To also remove data (fresh start next time):
docker-compose down -v
```

## Troubleshooting

### NUCLEI Not Found

If you see "NUCLEI not found" errors:

1. Verify NUCLEI is installed: `nuclei -version`
2. Ensure NUCLEI is in your PATH
3. Restart the backend: `docker-compose restart backend`

### Port Already in Use

If ports 3000, 3001, 5432, or 6379 are taken:

1. Stop conflicting services
2. Or edit `docker-compose.yml` to use different ports

### Scan Takes Too Long

Scans timeout after 5 minutes by default. To increase:

1. Edit `.env`: `SCAN_TIMEOUT=600000` (10 minutes)
2. Restart: `docker-compose restart backend`

### Database Connection Errors

```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

## Development Setup

For local development without Docker:

```bash
# 1. Start databases only
docker-compose up -d postgres redis

# 2. Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 3. Run development servers
npm run dev

# This runs both backend (port 3001) and frontend (port 3000)
```

## Project Structure

```
domain-scanner/
├── backend/              # Node.js + TypeScript API
│   ├── src/
│   │   ├── services/     # Business logic
│   │   │   ├── nuclei.service.ts
│   │   │   ├── translation.service.ts
│   │   │   └── scan.service.ts
│   │   ├── controllers/  # API handlers
│   │   ├── models/       # Data models
│   │   └── server.ts     # Entry point
│   └── package.json
├── frontend/             # React + TypeScript UI
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   └── services/     # API client
│   └── package.json
├── docker-compose.yml    # Container orchestration
└── README.md             # Documentation
```

## API Usage

You can also use the API directly:

### Create a Scan

```bash
curl -X POST http://localhost:3001/api/scans \
  -H "Content-Type: application/json" \
  -d '{"targetDomain":"example.com"}'
```

Response:
```json
{
  "message": "Scan created and queued",
  "scan": {
    "id": "uuid-here",
    "targetDomain": "example.com",
    "status": "PENDING"
  }
}
```

### Get Scan Results

```bash
curl http://localhost:3001/api/scans/{scan-id}/results
```

### List All Scans

```bash
curl http://localhost:3001/api/scans
```

## Important Security Notes

### ⚠️ Only Scan What You Own

**NEVER** scan domains you don't own or don't have permission to scan. Unauthorized scanning:
- May be illegal in your jurisdiction
- Violates terms of service
- Could be considered a cyber attack

### 🔒 Authentication Coming Soon

The MVP doesn't include authentication. This means:
- Anyone with access to your instance can create scans
- Don't expose your instance to the public internet
- Use it on local networks or behind authentication

Authentication will be added in Phase 2.

## What's Next?

The MVP includes core scanning and translation features. Coming in future phases:

**Phase 2 (Planned):**
- PDF/HTML report generation
- User authentication
- Scan scheduling
- Historical trends
- Email notifications

**Phase 3 (Planned):**
- Multi-tenant support
- Role-based access control
- Advanced analytics
- Custom risk frameworks

See [DEV_SCOPE.md](./DEV_SCOPE.md) for the complete roadmap.

## Need Help?

1. **Documentation**:
   - [README.md](./README.md) - Project overview
   - [MVP_IMPLEMENTATION.md](./MVP_IMPLEMENTATION.md) - Technical details
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
   - [UX_PRINCIPLES.md](./UX_PRINCIPLES.md) - Design philosophy

2. **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/Kiara-Dev-Team/domain-scanner/issues)

3. **Discussions**: Ask questions on [GitHub Discussions](https://github.com/Kiara-Dev-Team/domain-scanner/discussions)

## Philosophy

**We convert technical security value into business value without diminishing the underlying technical rigor.**

- ✅ Designed for business decision makers
- ✅ Translates technical findings to business impact
- ✅ Provides clear, actionable guidance
- ✅ Progressive disclosure (details on demand)
- ✅ Mobile-responsive design

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Acknowledgments

Built on top of [NUCLEI](https://github.com/projectdiscovery/nuclei) by [ProjectDiscovery](https://projectdiscovery.io). We're grateful for their excellent open-source security tooling.

---

**Ready to get started? Run `docker-compose up -d` and open http://localhost:3000** 🚀
