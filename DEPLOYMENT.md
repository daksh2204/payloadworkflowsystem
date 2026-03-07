# Deployment Guide

## Vercel Deployment

### Prerequisites

1. Vercel account (https://vercel.com)
2. MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
3. Git repository with your code

### Step 1: Set Up MongoDB Atlas

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist Vercel IP addresses (or use 0.0.0.0/0 for all IPs)
4. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database
   ```

### Step 2: Build the Project

```bash
npm run build
```

Verify the build completes without errors.

### Step 3: Configure Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Link your project:
```bash
vercel link
```

### Step 4: Set Environment Variables

Add these environment variables in Vercel dashboard or via CLI:

```bash
vercel env add MONGODB_URI
# Paste your MongoDB Atlas connection string

vercel env add PAYLOAD_SECRET
# Enter a secure random string (use: openssl rand -base64 32)

vercel env add NODE_ENV
# Enter: production
```

### Step 5: Deploy

```bash
vercel deploy --prod
```

### Step 6: Seed Production Data

After deployment, seed the database:

```bash
# SSH into Vercel or run locally pointing to production DB
npm run seed
```

### Step 7: Verify Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app/admin`
2. Login with admin@demo.com / admin123
3. Create a test blog post
4. Verify workflow is triggered

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/db |
| PAYLOAD_SECRET | JWT signing secret | random-32-char-string |
| NODE_ENV | Environment | production |
| PORT | Server port (optional) | 3000 |

## Post-Deployment Checklist

- [ ] MongoDB connection successful
- [ ] Admin panel accessible
- [ ] Demo users created
- [ ] Sample workflow created
- [ ] Test blog post creation
- [ ] Test workflow approval
- [ ] API endpoints responding
- [ ] Workflow logs being created

## Troubleshooting

### Build Fails

Check TypeScript errors:
```bash
npm run build
```

### Database Connection Issues

Verify MongoDB URI and network access in Atlas

### API Endpoints Not Working

Check Vercel function logs:
```bash
vercel logs
```

## Monitoring

- Use Vercel Analytics for request metrics
- Monitor MongoDB Atlas for database performance
- Check Vercel function logs for errors

## Security Recommendations

1. Use strong PAYLOAD_SECRET (32+ characters)
2. Enable MongoDB authentication
3. Restrict MongoDB network access
4. Use HTTPS only (Vercel provides this)
5. Regularly rotate secrets
6. Monitor access logs

## Scaling Considerations

- Vercel automatically scales serverless functions
- MongoDB Atlas can be scaled vertically/horizontally
- Consider adding Redis for caching workflow definitions
- Implement rate limiting for API endpoints
