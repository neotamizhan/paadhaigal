# Deployment Guide - MongoLab API Key Fix

This guide explains the changes made to fix the exposed MongoLab API key and how to deploy the updated application.

## What Was Changed

### 1. Backend Changes (poem.rb)
- **Before**: API key was hardcoded directly in the code
- **After**: API key is read from environment variable `ENV['MONGOLAB_API_KEY']`

### 2. Frontend Changes (public/js/app.js)
- **Before**: Frontend directly accessed MongoLab API with exposed credentials
- **After**: Frontend calls backend REST endpoints (`/api/v1/*`) only
- Removed `MONGOLAB_CONFIG` constant
- Removed `mongolabResourceHttp` module dependency
- Refactored Poetry factory to use `$http` for backend API calls

### 3. New Files Added
- `.env.example` - Template for environment variables
- `docs/security/security-audit-2025-10-15.md` - Security audit report
- `docs/security/secrets-inventory-2025-10-15.csv` - Secrets inventory

### 4. Files Removed
- `.c9revisions/` - Contained exposed API keys
- `public/js/app.js.old` - Backup file with exposed keys

### 5. Updated Files
- `.gitignore` - Now excludes `.env`, revision files, and backups
- `Gemfile` - Updated to use https for rubygems

## Deployment Instructions

### Step 1: Set Environment Variables

#### For Local Development
```bash
export MONGOLAB_API_KEY=your_api_key_here
export RACK_ENV=development
export PORT=4567
```

Or create a `.env` file (not committed to git):
```
MONGOLAB_API_KEY=your_api_key_here
RACK_ENV=development
PORT=4567
```

#### For Heroku
```bash
heroku config:set MONGOLAB_API_KEY=your_api_key_here
heroku config:set RACK_ENV=production
# PORT is automatically set by Heroku
```

### Step 2: Rotate the Exposed API Key ⚠️

**CRITICAL**: The old API key (`50aa141ce4b0021e6aceebc0`) was exposed in the repository history.

1. Go to your MongoLab dashboard
2. Generate a new API key
3. Update the environment variable with the new key
4. Revoke/delete the old exposed key

### Step 3: Install Dependencies
```bash
bundle install
```

### Step 4: Start the Application

#### Local Development
```bash
# With Ruby directly
ruby poem.rb

# Or with Rack
bundle exec rackup config.ru -p $PORT
```

#### Heroku
```bash
git push heroku main
```

## Verification

After deployment, verify that:

1. **Application starts successfully** without errors
2. **Search functionality works**:
   - Text search: Enter any Tamil text
   - Tag search: Enter `tags:thirukkural`
   - Serial search: Enter `kural 1`
3. **API key is not exposed** in browser:
   - Open browser DevTools → Network tab
   - Perform a search
   - Verify requests go to `/api/v1/*` (not to mongolab.com)
   - Verify no API key appears in request headers or URLs
4. **Check application logs** for any errors related to missing environment variables

## Testing Checklist

- [ ] Environment variable `MONGOLAB_API_KEY` is set
- [ ] Application starts without errors
- [ ] Text search works (e.g., search for "ஆதி")
- [ ] Tag search works (e.g., "tags:thirukkural")
- [ ] Serial search works (e.g., "kural 1")
- [ ] All requests go to `/api/v1/*` endpoints (check Network tab)
- [ ] No API key visible in browser (check source, console, network)
- [ ] Old API key has been rotated/revoked

## How the Application Works Now

### Architecture Flow

```
User Browser
    ↓
[Frontend: AngularJS]
    ↓ (calls /api/v1/* endpoints)
[Backend: Sinatra/Ruby]
    ↓ (uses ENV['MONGOLAB_API_KEY'])
[MongoLab API]
    ↓
[MongoDB Database]
```

### API Endpoints

The frontend now calls these backend endpoints:

- `GET /api/v1/tags/:tags` - Search by tags
- `GET /api/v1/tags` - Get all tags
- `GET /api/v1/searchtext/:term` - Search by text
- `GET /api/v1/search` - Default search
- `GET /api/v1/:urlkey/:serial` - Get specific poem

### Security Improvements

1. ✅ **No credentials in source code** - All secrets in environment variables
2. ✅ **No credentials sent to browser** - API key stays on server
3. ✅ **Single source of truth** - Backend manages all database access
4. ✅ **Proper separation of concerns** - Frontend doesn't know about database
5. ✅ **Audit trail** - All database access goes through backend (can be logged)

## Next Steps (Recommended)

### Short-term (Days 3-7)
1. Add dotenv gem for easier local development
2. Set up monitoring for API key usage
3. Add request logging for security auditing
4. Update README with new environment setup instructions

### Medium-term (Days 8-30)
1. Migrate from MongoLab to MongoDB Atlas
2. Implement rate limiting on API endpoints
3. Add CORS configuration
4. Set up security headers

### Long-term (30+ days)
1. Add user authentication for write operations
2. Implement Redis caching
3. Add secret management service (e.g., Vault)
4. Set up automated security scanning in CI/CD

## Troubleshooting

### Error: "undefined method for nil:NilClass" related to ENV
**Solution**: Make sure `MONGOLAB_API_KEY` environment variable is set.

### Error: Connection to MongoLab fails
**Solutions**:
1. Verify the API key is correct
2. Check if the old key was rotated
3. Verify network connectivity to api.mongolab.com

### Frontend shows "No poems found"
**Solutions**:
1. Check browser console for errors
2. Verify backend is running and accessible
3. Check Network tab - requests should go to `/api/v1/*`
4. Verify backend can connect to MongoLab

### Heroku deployment fails
**Solutions**:
1. Ensure `MONGOLAB_API_KEY` is set in Heroku config
2. Check Heroku logs: `heroku logs --tail`
3. Verify Procfile is correct

## Support

For issues or questions:
1. Check the security audit report: `docs/security/security-audit-2025-10-15.md`
2. Review the secrets inventory: `docs/security/secrets-inventory-2025-10-15.csv`
3. Check application logs for detailed error messages

## Security Notes

⚠️ **Important Security Reminders**:
- Never commit `.env` files to git
- Rotate API keys immediately if accidentally exposed
- Keep `db.yaml` excluded from git (already in `.gitignore`)
- Review the security audit report for additional recommendations
- Monitor API usage for unusual patterns

---

**Last Updated**: October 15, 2025  
**PR**: Fix exposed MongoLab API key  
**Status**: Ready for deployment
