# Architecture Evolution - Paadhaigal

This document visualizes the transformation from current to modern architecture.

## Current Architecture (Legacy)

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  AngularJS 1.x + Bootstrap 3 + jQuery             │  │
│  │  - No build system                                 │  │
│  │  - Direct API calls with hardcoded keys            │  │
│  │  - No state management                             │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ HTTP/HTTPS
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   HEROKU INSTANCE                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Ruby Sinatra Application                 │  │
│  │           - poem.rb (all endpoints)                │  │
│  │           - No caching                             │  │
│  │           - Hardcoded API keys                     │  │
│  │           - Direct MongoDB calls                   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ MongoLab API (Deprecated)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    MONGOLAB (OLD)                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │         MongoDB Database                           │  │
│  │         - poems collection                         │  │
│  │         - Basic indexes                            │  │
│  │         - No vector search                         │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Issues:**
- ❌ Security: Hardcoded API keys
- ❌ Performance: No caching, inefficient regex searches
- ❌ Scalability: Single Heroku dyno, no load balancing
- ❌ Maintainability: Deprecated frameworks (AngularJS 1.x)
- ❌ Features: Basic text search only, no AI
- ❌ Mobile: Poor mobile experience
- ❌ Monitoring: No observability

---

## Target Architecture (Modern + AI)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         CLIENTS (Multi-Platform)                          │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   Web App   │  │ Mobile Apps │  │     PWA     │  │  Voice (Alexa)  │ │
│  │  React +    │  │React Native │  │  Service    │  │  Google Action  │ │
│  │  TypeScript │  │  iOS/Android│  │   Workers   │  │                 │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
                                   │
                            HTTPS (TLS 1.3)
                                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                            CDN LAYER                                      │
│              Cloudflare / AWS CloudFront / Fastly                         │
│  - Static asset caching                                                   │
│  - DDoS protection                                                        │
│  - Edge caching for API responses                                        │
│  - Global distribution                                                    │
└──────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                       API GATEWAY / LOAD BALANCER                         │
│  - Rate limiting                                                          │
│  - Authentication (JWT)                                                   │
│  - Request routing                                                        │
│  - SSL termination                                                        │
└──────────────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
┌────────────────────────────────┐  ┌──────────────────────────────┐
│    BACKEND API SERVICES        │  │   AI/ML SERVICE LAYER        │
│    (Kubernetes / ECS)          │  │   (Separate Microservice)    │
│                                │  │                              │
│ ┌────────────────────────────┐ │  │ ┌──────────────────────────┐│
│ │   FastAPI Application      │ │  │ │  Semantic Search         ││
│ │   - REST API v2            │ │  │ │  - Tamil-BERT embeddings ││
│ │   - GraphQL (optional)     │ │  │ │  - Vector similarity     ││
│ │   - WebSocket for live     │ │  │ └──────────────────────────┘│
│ │   - Auto-scaling pods      │ │  │                              │
│ └────────────────────────────┘ │  │ ┌──────────────────────────┐│
│                                │  │ │  LLM Service             ││
│ ┌────────────────────────────┐ │  │ │  - GPT-4 / Claude        ││
│ │   Background Workers       │ │  │ │  - Explanations          ││
│ │   (Celery + Redis)         │ │  │ │  - Chatbot               ││
│ │   - Email notifications    │ │  │ └──────────────────────────┘│
│ │   - AI processing jobs     │ │  │                              │
│ │   - Data ingestion         │ │  │ ┌──────────────────────────┐│
│ └────────────────────────────┘ │  │ │  NLP Pipeline            ││
│                                │  │ │  - Auto-tagging          ││
│ ┌────────────────────────────┐ │  │ │  - Sentiment analysis    ││
│ │   Auth Service             │ │  │ │  - Entity extraction     ││
│ │   - JWT tokens             │ │  │ └──────────────────────────┘│
│ │   - OAuth2 (optional)      │ │  │                              │
│ │   - User management        │ │  │ ┌──────────────────────────┐│
│ └────────────────────────────┘ │  │ │  TTS Service             ││
│                                │  │ │  - Google/Azure TTS      ││
└────────────────────────────────┘  │ │  - Audio caching         ││
                │                   │ └──────────────────────────┘│
                │                   │                              │
                │                   │ ┌──────────────────────────┐│
                │                   │ │  Recommendation Engine   ││
                │                   │ │  - Collaborative filter  ││
                │                   │ │  - Content-based         ││
                │                   │ └──────────────────────────┘│
                │                   └──────────────────────────────┘
                │                                 │
                ├─────────────────────────────────┘
                │
    ┌───────────┴───────────┬──────────────┬────────────────┐
    ▼                       ▼              ▼                ▼
┌──────────┐      ┌──────────────┐  ┌──────────────┐  ┌────────────┐
│  Redis   │      │  MongoDB     │  │  Pinecone    │  │PostgreSQL  │
│  Cache   │      │  Atlas       │  │  Vector DB   │  │(Optional)  │
│          │      │              │  │              │  │            │
│ - API    │      │ - Poems      │  │ - Embeddings │  │- Users     │
│ - Session│      │ - Users      │  │ - Similarity │  │- Analytics │
│ - AI resp│      │ - Tags       │  │   search     │  │            │
└──────────┘      │ - Analytics  │  └──────────────┘  └────────────┘
                  │ - Full-text  │
                  │   search     │
                  └──────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  S3 Storage  │
                  │              │
                  │ - Generated  │
                  │   audio      │
                  │ - Generated  │
                  │   images     │
                  │ - Backups    │
                  └──────────────┘
```

---

## Data Flow Examples

### 1. Traditional Text Search (Current)

```
User Input: "ஆதி"
    │
    ▼
[AngularJS Controller]
    │
    ▼
[Sinatra API] → Regex Query → [MongoDB]
    │                              │
    ▼                              ▼
[JSON Response] ← ← ← ← ← [Raw Docs]
    │
    ▼
[Display Results]
```

**Problems:** 
- Slow regex on large datasets
- No relevance ranking
- Exact match only

---

### 2. AI-Powered Semantic Search (Future)

```
User Input: "காதல் பாடல்கள்" (love poems)
    │
    ▼
[React Component]
    │
    ▼
[API Gateway] → [FastAPI Backend]
    │                    │
    │                    ▼
    │           [Generate Embedding]
    │                    │
    │                    ▼
    │           [Vector DB Query] → [Pinecone]
    │                    │              │
    │                    ▼              ▼
    │           [Similar Vectors] ← ← ← [Top-k Results]
    │                    │
    │                    ▼
    │           [Fetch Full Docs] → [MongoDB]
    │                    │              │
    │                    ▼              ▼
    │           [Enrich Results] ← ← ← [Poem Data]
    │                    │
    │                    ▼
    │           [Apply ML Ranking]
    │                    │
    ▼                    ▼
[Cached in Redis] ← [JSON Response]
    │
    ▼
[Display with Relevance Score]
```

**Benefits:**
- Finds semantically similar poems
- Understands intent
- Ranked by relevance
- Cached for performance

---

### 3. AI Explanation Generation

```
User clicks "Explain this poem"
    │
    ▼
[React Component] → [API Request]
    │
    ▼
[Check Redis Cache]
    │
    ├─ Hit → Return cached explanation
    │
    └─ Miss ▼
        [Queue Celery Task]
            │
            ▼
        [AI Service]
            │
            ▼
        [LLM API Call] → [GPT-4/Claude]
            │                   │
            ▼                   ▼
        [Post-process] ← [Generated Text]
            │
            ▼
        [Cache in Redis]
            │
            ▼
        [Return to User]
```

**Benefits:**
- Async processing
- Cached responses
- Cost optimization

---

## Infrastructure Comparison

### Current Infrastructure

```
┌─────────────────────────────────────┐
│         Heroku Free Tier            │
│  - Single dyno                      │
│  - Sleeps after 30 min inactivity   │
│  - No scaling                       │
│  - 512 MB RAM                       │
└─────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│         MongoLab                    │
│  - Deprecated service               │
│  - No backup automation             │
│  - Limited features                 │
└─────────────────────────────────────┘
```

**Costs:** ~$0-7/month (minimal hosting)

**Limitations:**
- Downtime when dyno sleeps
- No scalability
- Single point of failure
- No monitoring

---

### Modern Infrastructure (Production-Ready)

```
┌──────────────────────────────────────────────────────────┐
│              Kubernetes Cluster (AWS EKS)                │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  API Pod │  │  API Pod │  │  API Pod │  (Auto-scale)│
│  │  (2 CPU  │  │  (2 CPU  │  │  (2 CPU  │             │
│  │   4GB)   │  │   4GB)   │  │   4GB)   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
│  ┌──────────┐  ┌──────────┐                            │
│  │Worker Pod│  │Worker Pod│                            │
│  └──────────┘  └──────────┘                            │
│                                                          │
│  ┌──────────────────────────┐                          │
│  │   Redis Cluster          │                          │
│  │   (High Availability)    │                          │
│  └──────────────────────────┘                          │
└──────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│              MongoDB Atlas M10 Cluster                   │
│  - Multi-region replication                              │
│  - Automated backups                                     │
│  - Point-in-time recovery                                │
│  - Vector search support                                 │
└──────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│                 Observability Stack                      │
│  - Prometheus (metrics)                                  │
│  - Grafana (dashboards)                                  │
│  - ELK / Loki (logs)                                     │
│  - Jaeger (tracing)                                      │
│  - Sentry (error tracking)                               │
└──────────────────────────────────────────────────────────┘
```

**Costs:** ~$800-2000/month (production scale)

**Benefits:**
- 99.9% uptime SLA
- Auto-scaling (1-20 pods)
- Load balancing
- Disaster recovery
- Full observability
- Security compliance

---

## Migration Strategy

### Phase 1: Parallel Infrastructure

```
                    ┌─────────────────┐
                    │   DNS / Router   │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
          90% │                         10% │
              ▼                             ▼
    ┌─────────────────┐            ┌──────────────────┐
    │  OLD SYSTEM     │            │   NEW SYSTEM     │
    │  (Sinatra)      │            │   (FastAPI)      │
    │  AngularJS      │            │   React          │
    └─────────────────┘            └──────────────────┘
              │                             │
              └──────────────┬──────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │   MongoDB    │
                      │  (Shared DB) │
                      └──────────────┘
```

**Strategy:**
1. Deploy new system alongside old
2. Route small % of traffic to new system
3. Monitor metrics and errors
4. Gradually increase new system traffic
5. Keep old system as fallback
6. Decommission after full migration

---

### Phase 2: Feature Rollout

```
Week 1-2:   Basic API migration
            └─ Core endpoints working

Week 3-4:   Frontend React app
            └─ Feature parity with old UI

Week 5-6:   Redis caching
            └─ Performance improvements

Week 7-8:   First AI feature: Semantic search
            └─ Vector embeddings + search

Week 9-10:  Second AI feature: Auto-tagging
            └─ NLP-based tag suggestions

Week 11-12: Third AI feature: TTS
            └─ Audio playback

Week 13-14: Mobile optimizations
            └─ PWA features

Week 15-16: User authentication
            └─ JWT-based auth

Week 17-18: Recommendations
            └─ ML-based suggestions

Week 19-20: Full production deployment
            └─ 100% traffic on new system
```

---

## Scaling Roadmap

### Small Scale (0-10K users/day)

```
- 2 API pods
- MongoDB Atlas M10
- Redis single instance
- CloudFlare CDN
- Basic monitoring

Cost: ~$300/month
```

### Medium Scale (10K-100K users/day)

```
- 5-10 API pods (auto-scale)
- MongoDB Atlas M30 (3-node replica set)
- Redis cluster (3 nodes)
- CloudFlare CDN + caching
- Full observability stack
- Background workers

Cost: ~$1500/month
```

### Large Scale (100K-1M users/day)

```
- 20-50 API pods (auto-scale)
- MongoDB Atlas M60+ (sharded cluster)
- Redis cluster (5 nodes)
- Multi-region deployment
- Dedicated AI service cluster
- Advanced caching strategies
- 24/7 monitoring

Cost: ~$5000-10000/month
```

---

## Security Architecture

### Current (Insecure)

```
[Client] → [API with hardcoded keys] → [Database]
```

**Vulnerabilities:**
- ✗ API keys in source code
- ✗ No authentication
- ✗ No rate limiting
- ✗ No HTTPS enforcement
- ✗ No input validation

---

### Modern (Secure)

```
[Client]
   │
   └─ HTTPS only
   │
   ▼
[CDN with DDoS protection]
   │
   ▼
[WAF - Web Application Firewall]
   │
   ▼
[API Gateway]
   ├─ Rate limiting
   ├─ JWT validation
   └─ Request validation
   │
   ▼
[Backend Services]
   ├─ Environment variables for secrets
   ├─ AWS Secrets Manager integration
   ├─ Input sanitization
   ├─ SQL/NoSQL injection prevention
   └─ Output encoding
   │
   ▼
[Database]
   ├─ Network isolation (VPC)
   ├─ Encrypted at rest
   ├─ Encrypted in transit
   ├─ Regular backups
   └─ Point-in-time recovery
```

**Security Features:**
- ✓ No secrets in code
- ✓ JWT authentication
- ✓ Rate limiting (100 req/min per IP)
- ✓ HTTPS with TLS 1.3
- ✓ Input validation
- ✓ OWASP Top 10 protection
- ✓ Security headers (CSP, HSTS, etc.)
- ✓ Regular security audits
- ✓ Dependency scanning
- ✓ Penetration testing

---

## Monitoring & Observability

### Current: Minimal

```
- Heroku logs (24 hours retention)
- No metrics
- No dashboards
- No alerts
```

---

### Modern: Comprehensive

```
┌────────────────────────────────────────────┐
│         Application Metrics (Prometheus)    │
├────────────────────────────────────────────┤
│ - Request rate, latency, errors            │
│ - Database query performance               │
│ - Cache hit ratios                         │
│ - AI API call costs                        │
│ - Background job queue length              │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│         Logs (ELK Stack / Loki)             │
├────────────────────────────────────────────┤
│ - Structured JSON logs                     │
│ - Full-text search                         │
│ - 30-day retention                         │
│ - Real-time streaming                      │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│         Distributed Tracing (Jaeger)        │
├────────────────────────────────────────────┤
│ - Request flow visualization               │
│ - Performance bottleneck identification    │
│ - Service dependency mapping               │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│         Error Tracking (Sentry)             │
├────────────────────────────────────────────┤
│ - Real-time error notifications            │
│ - Stack traces with source maps            │
│ - Error grouping and trends                │
│ - Release tracking                         │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│         Dashboards (Grafana)                │
├────────────────────────────────────────────┤
│ - Real-time metrics visualization          │
│ - Custom alerts                            │
│ - SLA tracking                             │
│ - Cost monitoring                          │
└────────────────────────────────────────────┘
```

---

## Development Workflow

### Current: Manual

```
[Local Dev] → [Manual Testing] → [Git Push] → [Heroku Deploy]
```

---

### Modern: Automated CI/CD

```
[Local Dev]
   │
   ├─ Pre-commit hooks (linting, formatting)
   │
   ▼
[Git Push]
   │
   ▼
[GitHub Actions CI]
   ├─ Run tests (unit, integration)
   ├─ Code quality checks (SonarQube)
   ├─ Security scanning (Snyk, Trivy)
   ├─ Build Docker images
   └─ Push to registry
   │
   ▼
[Staging Deployment]
   ├─ Deploy to staging cluster
   ├─ Run E2E tests (Playwright)
   ├─ Performance tests (K6)
   └─ Manual QA approval
   │
   ▼
[Production Deployment]
   ├─ Blue-green deployment
   ├─ Canary release (10% → 50% → 100%)
   ├─ Automated rollback on errors
   └─ Post-deployment smoke tests
   │
   ▼
[Monitoring & Alerts]
```

---

## Summary: Key Improvements

| Aspect | Current | Target | Improvement |
|--------|---------|--------|-------------|
| **Security** | Hardcoded keys | Environment vars + secrets mgmt | 🔒 Secure |
| **Performance** | No caching | Redis + CDN | ⚡ 10x faster |
| **Scalability** | 1 dyno | Auto-scaling pods | 📈 100x capacity |
| **Availability** | ~95% | 99.9% | 🎯 Production SLA |
| **Search** | Regex | Semantic AI search | 🧠 Intelligent |
| **Mobile** | Poor | PWA + Native apps | 📱 Mobile-first |
| **Monitoring** | Basic logs | Full observability | 👁️ Complete visibility |
| **AI Features** | None | 30+ AI capabilities | 🤖 AI-powered |
| **Cost** | $7/mo | $800-2000/mo | 💰 Scales with value |
| **Maintainability** | Deprecated stack | Modern, supported | 🛠️ Easy to maintain |

---

*See MODERNIZATION_ROADMAP.md for detailed implementation plans*  
*See AI_FEATURES_SUMMARY.md for AI feature specifications*
