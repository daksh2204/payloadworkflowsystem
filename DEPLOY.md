# Quick Deployment Guide

## Option 1: Railway.app (Recommended - Easiest)

1. Go to https://railway.app/
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose: `daksh2204/payloadworkflowsystem`
6. Railway will auto-detect and deploy

**Add MongoDB:**
7. Click "New" → "Database" → "Add MongoDB"
8. Copy the MongoDB connection string from variables
9. Add environment variable:
   - `MONGODB_URI`: (paste MongoDB string from Railway)
   - `PAYLOAD_SECRET`: (generate random 32 chars)
   - `NODE_ENV`: production

10. Redeploy
11. Get your live URL from Railway dashboard

**Seed database:**
```bash
# Update .env with Railway MongoDB URI
npm run seed
```

---

## Option 2: Vercel + MongoDB Atlas

**MongoDB Atlas (Free):**
1. https://mongodb.com/cloud/atlas → Sign up
2. Create M0 FREE cluster
3. Create user: `payloaduser` with password
4. Network: Allow 0.0.0.0/0
5. Get connection string

**Vercel:**
1. https://vercel.com → Sign up with GitHub
2. Import: `daksh2204/payloadworkflowsystem`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   - `MONGODB_URI`: (your Atlas string)
   - `PAYLOAD_SECRET`: (random 32 chars)
   - `NODE_ENV`: production
6. Deploy

---

## After Deployment

1. Visit your live URL: `https://your-app.railway.app/admin`
2. Seed database: `npm run seed`
3. Login: admin@demo.com / admin123
4. Test workflow creation

---

## Credentials

```
Admin:    admin@demo.com / admin123
Reviewer: reviewer@demo.com / reviewer123
Editor:   editor@demo.com / editor123
```

