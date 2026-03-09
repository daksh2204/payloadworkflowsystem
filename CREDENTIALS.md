# System Credentials and Access Information

## Demo User Accounts

### 1. Admin Account
- **Email**: admin@demo.com
- **Password**: admin123
- **Role**: admin

**Permissions:**
- ✅ Create and manage workflow definitions
- ✅ Approve/reject any workflow step
- ✅ View all workflow logs
- ✅ Full CRUD access to all collections (blogs, contracts, users)
- ✅ Access to all admin panel features
- ✅ Can assign workflows to any collection
- ✅ Can manage user accounts

**Use Cases:**
- Creating new workflow definitions
- Final approval in multi-step workflows
- System administration
- User management
- Viewing complete audit trails

---

### 2. Reviewer Account
- **Email**: reviewer@demo.com
- **Password**: reviewer123
- **Role**: reviewer

**Permissions:**
- ✅ Review and approve assigned review steps
- ✅ Add comments to workflows
- ✅ View workflow logs for assigned documents
- ✅ Create and edit blogs/contracts
- ✅ View workflow status
- ❌ Cannot create workflow definitions
- ❌ Cannot approve admin-level steps
- ❌ Cannot manage users

**Use Cases:**
- First-level review of blog posts
- First-level review of contracts
- Adding review comments
- Content quality assurance

---

### 3. Editor Account
- **Email**: editor@demo.com
- **Password**: editor123
- **Role**: editor

**Permissions:**
- ✅ Create blogs and contracts
- ✅ Edit own documents
- ✅ View workflow status on own documents
- ✅ Add comments to workflows
- ❌ Cannot approve/reject workflow steps
- ❌ Cannot create workflow definitions
- ❌ Cannot manage users
- ❌ Limited access to other users' documents

**Use Cases:**
- Creating blog posts
- Creating contracts
- Submitting documents for approval
- Tracking approval status

---

## Access URLs

### Production Deployment
- **Admin Panel**: `https://your-project.vercel.app/admin`
- **API Base URL**: `https://your-project.vercel.app/api`

### Local Development
- **Admin Panel**: `http://localhost:3000/admin`
- **API Base URL**: `http://localhost:3000/api`

---

## API Authentication

### Getting JWT Token

1. Login via Admin UI or API:
```bash
curl -X POST https://your-project.vercel.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.com",
    "password": "admin123"
  }'
```

2. Response will include JWT token:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@demo.com",
    "role": "admin"
  }
}
```

3. Use token in subsequent requests:
```bash
curl https://your-project.vercel.app/api/workflows/status/DOCUMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Database Credentials

### MongoDB Atlas
- **Connection String**: Set in environment variable `MONGODB_URI`
- **Database Name**: `payload-workflow`
- **Collections**:
  - `users`
  - `workflow-definitions`
  - `workflow-logs`
  - `blogs`
  - `contracts`

---

## Environment Variables

### Required for Deployment

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/payload-workflow

# Payload CMS Secret (for JWT signing)
PAYLOAD_SECRET=your-super-secret-key-minimum-32-characters-long

# Node Environment
NODE_ENV=production

# Server Port (optional, Vercel handles this)
PORT=3000
```

---

## Testing Credentials

### Test Workflow: Blog Approval

**Step 1: Login as Editor**
- Email: editor@demo.com
- Password: editor123
- Action: Create a new blog post

**Step 2: Login as Reviewer**
- Email: reviewer@demo.com
- Password: reviewer123
- Action: Review and approve the blog post

**Step 3: Login as Admin**
- Email: admin@demo.com
- Password: admin123
- Action: Final approval of the blog post

---

## Security Notes

### Production Deployment
1. ✅ All passwords are hashed using bcrypt
2. ✅ JWT tokens expire after 7 days
3. ✅ HTTPS enforced by Vercel
4. ✅ MongoDB connection uses TLS/SSL
5. ✅ Environment variables stored securely in Vercel

### Recommendations for Production
1. Change default passwords immediately
2. Use strong PAYLOAD_SECRET (32+ characters)
3. Rotate JWT secrets periodically
4. Enable MongoDB IP whitelisting
5. Implement rate limiting on API endpoints
6. Enable MongoDB audit logging
7. Set up monitoring and alerts

---

## Role-Based Access Control (RBAC) Matrix

| Feature | Admin | Reviewer | Editor |
|---------|-------|----------|--------|
| Create Workflow Definitions | ✅ | ❌ | ❌ |
| Edit Workflow Definitions | ✅ | ❌ | ❌ |
| Delete Workflow Definitions | ✅ | ❌ | ❌ |
| View Workflow Definitions | ✅ | ✅ | ✅ |
| Create Blogs/Contracts | ✅ | ✅ | ✅ |
| Edit Own Blogs/Contracts | ✅ | ✅ | ✅ |
| Edit Others' Blogs/Contracts | ✅ | ✅ | ❌ |
| Delete Blogs/Contracts | ✅ | ✅ | ❌ |
| Approve Review Steps | ✅ | ✅ | ❌ |
| Approve Admin Steps | ✅ | ❌ | ❌ |
| Reject Workflows | ✅ | ✅ | ❌ |
| Add Comments | ✅ | ✅ | ✅ |
| View Workflow Logs | ✅ | ✅ | ✅ (own only) |
| Create/Edit Users | ✅ | ❌ | ❌ |
| Trigger Workflows via API | ✅ | ✅ | ✅ |
| Query Workflow Status | ✅ | ✅ | ✅ |

---

## Quick Login Guide

### For Evaluators

1. **Admin Access** (Full System Access)
   ```
   URL: https://your-project.vercel.app/admin
   Email: admin@demo.com
   Password: admin123
   ```

2. **Reviewer Access** (Review & Approve)
   ```
   URL: https://your-project.vercel.app/admin
   Email: reviewer@demo.com
   Password: reviewer123
   ```

3. **Editor Access** (Content Creation)
   ```
   URL: https://your-project.vercel.app/admin
   Email: editor@demo.com
   Password: editor123
   ```

---

## API Endpoints with Authentication

### 1. Trigger Workflow
```bash
curl -X POST https://your-project.vercel.app/api/workflows/trigger \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "collection": "blogs",
    "documentId": "DOCUMENT_ID"
  }'
```

### 2. Get Workflow Status
```bash
curl https://your-project.vercel.app/api/workflows/status/DOCUMENT_ID?collection=blogs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Execute Workflow Action
```bash
curl -X POST https://your-project.vercel.app/api/workflows/action \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "documentId": "DOCUMENT_ID",
    "collection": "blogs",
    "action": "approve",
    "comment": "Looks good!"
  }'
```

---

## Troubleshooting Access Issues

### Cannot Login
1. Verify you're using the correct URL (production vs local)
2. Check that seed script has been run
3. Verify MongoDB connection is working
4. Check browser console for errors

### Unauthorized Errors
1. Ensure JWT token is valid and not expired
2. Check that user has required role for the action
3. Verify Authorization header format: `Bearer TOKEN`

### Workflow Not Triggering
1. Verify workflow definition exists for the collection
2. Check that document has `workflowStatus` and `currentWorkflowStep` fields
3. Review workflow logs for errors
4. Check MongoDB connection

---

## Support

For issues or questions:
1. Check deployment logs in Vercel dashboard
2. Review MongoDB Atlas logs
3. Check browser console for frontend errors
4. Review API response error messages

