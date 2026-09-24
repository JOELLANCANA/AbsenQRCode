# 🔧 Vercel Deployment Fix Guide

Error **"This page doesn't exist"** sudah diperbaiki. Berikut adalah cara memperbaiki deployment Anda.

---

## ❌ Problem

```
Error: "This page doesn't exist"
It may have been moved, removed, or never existed.
```

**Penyebab**: Routing configuration di `vercel.json` tidak benar.

---

## ✅ Solution

### Step 1: Update vercel.json

File `vercel-backend/vercel.json` sudah diupdate dengan routing yang benar:

```json
{
  "version": 2,
  "routes": [
    {
      "src": "^/api/(.*)$",
      "dest": "/index.js?path=/api/$1",
      "methods": ["GET", "POST", "OPTIONS"]
    },
    {
      "src": "^/health$",
      "dest": "/index.js",
      "methods": ["GET"]
    },
    {
      "src": "/(.*)",
      "dest": "/index.js",
      "methods": ["GET", "POST", "OPTIONS"]
    }
  ]
}
```

### Step 2: Update Backend Structure

Backend sudah direfactor menjadi:

```
vercel-backend/
├── api/
│   └── index.js         ← Main API handler (NEW)
├── index.js             ← Entry point (UPDATED)
├── package.json         ← Dependencies
├── vercel.json          ← Routing config (UPDATED)
└── .env.example
```

### Step 3: Redeploy to Vercel

```bash
# 1. Update files locally
cd vercel-backend

# 2. Push to GitHub
git add .
git commit -m "Fix: Update Vercel routing configuration"
git push origin main

# 3. Vercel auto-redeploys
# OR manually redeploy:
vercel --prod
```

### Step 4: Test

**Test health check:**
```
https://your-vercel-domain.vercel.app/health
```

Should return:
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "...",
    "environment": "production"
  }
}
```

**Test API endpoint:**
```
https://your-vercel-domain.vercel.app/api/participants
```

Should return:
```json
{
  "success": true,
  "data": {
    "participants": [...],
    "logs": [...]
  }
}
```

---

## 🔄 File Changes Summary

### vercel.json (UPDATED)
- ✅ Fixed routing for `/api/*` endpoints
- ✅ Added `/health` endpoint
- ✅ Added catch-all route to `/index.js`

### api/index.js (NEW)
- ✅ Created new API handler
- ✅ Contains all endpoints
- ✅ CORS, rate limiting, error handling

### index.js (UPDATED)
- ✅ Simplified to entry point only
- ✅ Exports API app
- ✅ Works with Vercel serverless

---

## 📋 Deployment Checklist

- [ ] Files updated locally
- [ ] Changes pushed to GitHub
- [ ] Vercel redeploys automatically
- [ ] Check Vercel Dashboard → Deployments
- [ ] Wait for build complete (should be green ✅)
- [ ] Test `/health` endpoint
- [ ] Test `/api/participants` endpoint
- [ ] Test `/api/participants/UIN-001` endpoint

---

## 🧪 Manual Testing

### Test 1: Health Check
```bash
curl https://your-domain.vercel.app/health
```

### Test 2: Get Participants
```bash
curl https://your-domain.vercel.app/api/participants
```

### Test 3: Find Participant
```bash
curl https://your-domain.vercel.app/api/participants/UIN-001
```

### Test 4: Update Status
```bash
curl -X POST https://your-domain.vercel.app/api/participants/UIN-001/status \
  -H "Content-Type: application/json" \
  -d '{"statusType":"HADIR"}'
```

All should return `"success": true`

---

## 🔍 If Still Not Working

### Check 1: Verify Build Success
1. Go to Vercel Dashboard
2. Click your project
3. Go to "Deployments"
4. Check latest deployment status
5. If red ❌ → See build logs

### Check 2: Check Environment Variables
1. Vercel Dashboard → Settings → Environment Variables
2. Verify all are set:
   - `ADMIN_PASSWORD`
   - `CORS_ORIGIN` (should be `*` or your domain)
   - Others optional

### Check 3: Check Logs
1. Vercel Dashboard → Logs
2. Look for errors in function logs
3. Check runtime errors

### Check 4: Rebuild Deployment
```bash
# Option A: Via CLI
vercel --prod --force

# Option B: Via Dashboard
1. Go to Deployments
2. Click latest deployment
3. Click "Redeploy"
```

---

## 📝 Update Frontend (If Using Vercel Backend)

In `gapps-sync.js`, update API URL:

```javascript
// Set this to your Vercel domain
window.API_BASE_URL = 'https://your-vercel-domain.vercel.app/api';
```

Then re-deploy Apps Script.

---

## 🚀 Quick Checklist After Fix

```
☐ Vercel deployment shows green ✅
☐ /health endpoint returns 200 OK
☐ /api/participants returns data
☐ /api/participants/:id works
☐ POST endpoints work (status update, etc)
☐ CORS headers present in response
☐ No 404 errors
☐ No 502 bad gateway
☐ Response time < 2 seconds
```

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Still 404 error | Check vercel.json is saved, redeploy |
| 502 Bad Gateway | Check function logs, may be syntax error |
| Slow response | Check Vercel performance, may be cold start |
| CORS error | Set `CORS_ORIGIN` in env vars or use `*` |
| Data not updating | Mock data is in-memory, persists per deployment only |

---

## ✨ Success Signs

When working correctly:

✅ Vercel deployment is green
✅ Health endpoint responds
✅ API returns data
✅ Frontend can call API
✅ No 404 or 502 errors
✅ Console has no errors
✅ Data persists during session

---

**Version**: 1.0.1 (Fixed)
**Status**: ✅ Ready to Deploy
**Updated**: September 24, 2026

**Next Step**: Redeploy to Vercel and test!
