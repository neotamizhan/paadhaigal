# Security Audit Report - Paadhaigal (பாதைகள்)

**Date:** October 15, 2025  
**Auditor:** Security Team  
**Repository:** neotamizhan/paadhaigal  
**Reference Commit:** a659fd4478e409c8cc732b96e1b348a759500d43

## Executive Summary

This security audit identifies critical vulnerabilities in the Paadhaigal application, specifically focusing on exposed API credentials and insecure credential management practices. The primary finding is the hardcoded MongoLab API key exposed in both backend and frontend code.

### Severity Rating: **CRITICAL**

## Findings

### 1. Hardcoded API Key in Backend (CRITICAL)

**Location:** `poem.rb`
- Line 17: `base_url` method contains hardcoded MongoLab API key
- Line 56: `get_json_rest` method contains hardcoded API key in URL

**Risk:** 
- Exposed API key allows unauthorized access to the MongoDB database
- Any user with repository access can extract and misuse the credentials
- Key is visible in version control history

**Impact:**
- Data breach: Unauthorized read/write access to poetry database
- Data integrity: Potential for malicious data modification
- Service disruption: API key could be rotated externally, breaking the service
- Cost implications: Unauthorized API usage could incur charges

### 2. Hardcoded API Key in Frontend (CRITICAL)

**Location:** `public/js/app.js`
- Line 33: `MONGOLAB_CONFIG` constant contains exposed API key

**Risk:**
- API key is transmitted to all users' browsers
- Visible in browser developer tools and network traffic
- Can be extracted by anyone visiting the website
- Enables direct access to MongoLab API from any origin

**Impact:**
- Public exposure of database credentials
- Unrestricted database access from any client
- Potential for abuse, data scraping, or DoS attacks
- No rate limiting or access control on database operations

### 3. Direct Database Access from Frontend (HIGH)

**Location:** `public/js/app.js`, `public/js/mongolabResourceHttp.js`

**Risk:**
- Frontend code directly communicates with MongoLab API
- Bypasses backend authentication and authorization controls
- No server-side validation of queries

**Impact:**
- Database schema exposure
- Potential for malicious query injection
- No audit trail for client operations
- Performance and security risks

### 4. Missing Environment Variable Configuration (HIGH)

**Risk:**
- No `.env.example` file documenting required environment variables
- Developers may not know which secrets to configure
- Increases risk of hardcoding secrets during development

**Impact:**
- Poor developer experience
- Increased likelihood of credential exposure
- Difficult onboarding for new contributors

## Recommendations

### Immediate Actions (Day 1 - This PR)

1. **Remove Hardcoded Credentials**
   - ✅ Update `poem.rb` to read API key from `ENV['MONGOLAB_API_KEY']`
   - ✅ Remove API key from `public/js/app.js`
   - ✅ Update frontend to use backend API endpoints only

2. **Environment Configuration**
   - ✅ Create `.env.example` with documented environment variables
   - ✅ Add `MONGOLAB_API_KEY` to environment variables
   - ⚠️ Rotate exposed API key immediately after deployment

3. **Frontend Refactoring**
   - ✅ Remove `mongolabResourceHttp` direct database access
   - ✅ Update Angular app to use backend REST endpoints (`/api/v1/*`)
   - ✅ Ensure all database operations go through backend

4. **Documentation**
   - ✅ Document security findings in this audit report
   - ✅ Create secrets inventory (see `secrets-inventory-2025-10-15.csv`)
   - Update README with environment setup instructions

### Short-term Actions (Days 3-7)

1. **Environment Management**
   - Add dotenv gem for local development
   - Document deployment process for Heroku config vars
   - Create deployment checklist including secret rotation

2. **API Key Rotation**
   - Generate new MongoLab API key
   - Update production environment variables
   - Verify old key is revoked
   - Test application with new credentials

3. **Access Logging**
   - Add logging for all database access attempts
   - Monitor for unusual patterns or unauthorized access
   - Set up alerts for failed authentication

### Medium-term Actions (Days 8-30)

1. **Migration to MongoDB Atlas**
   - Move from deprecated MongoLab to MongoDB Atlas
   - Use connection string URI instead of API keys
   - Implement IP whitelisting and network security
   - Enable database access logs and monitoring

2. **Authentication & Authorization**
   - Implement user authentication for write operations
   - Add role-based access control (RBAC)
   - Rate limiting on API endpoints
   - CSRF protection for state-changing operations

3. **Security Headers**
   - Add Content Security Policy (CSP)
   - Enable HTTPS redirect
   - Set secure cookie flags
   - Add HSTS headers

4. **Dependency Updates**
   - Update Ruby gems to latest versions
   - Update JavaScript libraries (especially AngularJS)
   - Run security audit on dependencies (`bundle audit`, `npm audit`)

### Long-term Actions (30+ days)

1. **Infrastructure Modernization**
   - Migrate to modern MongoDB driver with connection pooling
   - Implement Redis caching layer
   - Add secret management service (e.g., HashiCorp Vault, AWS Secrets Manager)
   - Set up CI/CD with automated security scanning

2. **Application Security**
   - Add input validation and sanitization
   - Implement query parameter validation
   - Add request signing/HMAC for API calls
   - Regular penetration testing

3. **Monitoring & Incident Response**
   - Set up Sentry or similar error tracking
   - Create incident response plan
   - Regular security audits
   - Automated vulnerability scanning

## Testing Checklist

- [x] Backend reads API key from environment variable
- [x] Frontend calls backend endpoints only (no direct DB access)
- [x] API key not present in client-side code
- [x] API key not logged or exposed in network traffic
- [ ] Application functions correctly with ENV-based credentials
- [ ] All search operations work through backend API
- [ ] Tag queries work through backend API
- [ ] Serial number lookup works through backend API

## Compliance Considerations

- **GDPR**: If user data is added, ensure proper consent and data protection
- **Data Retention**: Document and implement data retention policies
- **Audit Trails**: Maintain logs of all data access for compliance
- **Right to Access**: Prepare for user data access requests if applicable

## Conclusion

The hardcoded API key exposure represents a critical security vulnerability that must be addressed immediately. This PR implements the essential fixes to remove exposed credentials and route all data access through the backend API.

**Key Changes:**
1. Backend now reads credentials from environment variables
2. Frontend uses backend REST API exclusively
3. No secrets remain in source code
4. Environment configuration documented in `.env.example`

**Next Steps:**
1. Deploy this PR to production
2. Rotate the exposed API key immediately
3. Monitor for any unauthorized access attempts
4. Proceed with Day 3-7 recommendations

---

**Audit Status:** Complete  
**Remediation Status:** In Progress (This PR)  
**Follow-up Date:** October 22, 2025 (7 days post-deployment)
