# Deployment Guide

## Vercel Deployment

### Prerequisites

- Vercel account
- MongoDB Atlas account
- GitHub repository

### Steps

1. **Set up MongoDB Atlas**
   - Create free M0 cluster
   - Create database user
   - Whitelist IP: 0.0.0.0/0
   - Get connection string

2. **Deploy to Vercel**
   - Import GitHub repository
   - Configure build:
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add environment variables:
     - `MONGODB_URI`
     - `PAYLOAD_SECRET`
     - `NODE_ENV=production`
   - Deploy

3. **Seed database**
   ```bash
   npm run seed
   ```

4. **Verify**
   - Visit: `https://your-project.vercel.app/admin`
   - Login with demo credentials
   - Test workflow creation

## Environment Variables

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/payload-workflow
PAYLOAD_SECRET=your-secret-key
NODE_ENV=production
```

## Troubleshooting

- **Build fails**: Check TypeScript errors with `npm run build`
- **Connection fails**: Verify MongoDB URI and network access
- **Admin 404**: Check vercel.json routes configuration

