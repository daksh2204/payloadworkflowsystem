# Deployment Checklist for WeframeTech Submission

## Pre-Deployment Checklist

- [ ] Code is committed to GitHub
- [ ] All TypeScript errors are resolved
- [ ] Build completes successfully (`npm run build`)
- [ ] Local testing completed
- [ ] Environment variables documented

---

## Step 1: MongoDB Atlas Setup (15 minutes)

### 1.1 Create MongoDB Atlas Account
- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Sign up for free account
- [ ] Verify email address

### 1.2 Create Database Cluster
- [ ] Click "Build a Database"
- [ ] Select "M0 Free" tier
- [ ] Choose cloud provider: AWS
- [ ] Choose region: Closest to you (e.g., Mumbai for India)
- [ ] Cluster name: `PayloadWorkflow`
- [ ] Click "Create"
- [ ] Wait 3-5 minutes for cluster to provision

### 1.3 Create Database User
- [ ] Go to "Database Access" in left sidebar
- [ ] Click "Add New Database User"
- [ ] Authentication Method: Password
- [ ] Username: `payloaduser`
- [ ] Password: Click "Autogenerate Secure Password" (SAVE THIS!)
- [ ] Database User Privileges: "Atlas admin"
- [ ] Click "Add User"

### 1.4 Configure Network Access
- [ ] Go to "Network Access" in left sidebar
- [ ] Click "Add IP Address"
- [ ] Click "Allow Access from Anywhere" (0.0.0.0/0)
- [ ] Click "Confirm"

### 1.5 Get Connection String
- [ ] Go to "Database" in left sidebar
- [ ] Click "Connect" on your cluster
- [ ] Choose "Connect your application"
- [ ] Driver: Node.js, Version: 5.5 or later
- [ ] Copy connection string:
   ```
   mongodb+srv://payloaduser:<password>@payloadworkflow.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
- [ ] Replace `<password>` with your actual password
- [ ] Add database name: `/payload-workflow` before the `?`
- [ ] Final format:
   ```
   mongodb+srv://payloaduser:YOUR_PASSWORD@payloadworkflow.xxxxx.mongodb.net/payload-workflow?retryWrites=true&w=majority
   ```
- [ ] **SAVE THIS CONNECTION STRING!**

---

## Step 2: Vercel Deployment (10 minutes)

### 2.1 Create Vercel Account
- [ ] Go to https://vercel.com
- [ ] Click "Sign Up"
- [ ] Choose "Continue with GitHub"
- [ ] Authorize Vercel to access your GitHub

### 2.2 Import Project
- [ ] Click "Add New..." → "Project"
- [ ] Find your repository: `daksh2204/payloadworkflowsystem`
- [ ] Click "Import"

### 2.3 Configure Project
- [ ] Project Name: `payload-workflow-system` (or your choice)
- [ ] Framework Preset: **Other**
- [ ] Root Directory: `./` (leave as is)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### 2.4 Add Environment Variables
Click "Environment Variables" and add these:

**Variable 1:**
- [ ] Name: `MONGODB_URI`
- [ ] Value: Your MongoDB connection string from Step 1.5
- [ ] Environment: Production, Preview, Development (check all)

**Variable 2:**
- [ ] Name: `PAYLOAD_SECRET`
- [ ] Value: Generate a random 32+ character string
  - Use: https://www.random.org/strings/ (32 chars, alphanumeric)
  - Or run: `openssl rand -base64 32` in terminal
- [ ] Environment: Production, Preview, Development (check all)

**Variable 3:**
- [ ] Name: `NODE_ENV`
- [ ] Value: `production`
- [ ] Environment: Production only

### 2.5 Deploy
- [ ] Click "Deploy"
- [ ] Wait 3-5 minutes for deployment
- [ ] Check deployment logs for errors
- [ ] Note your deployment URL: `https://your-project.vercel.app`

### 2.6 Verify Deployment
- [ ] Visit `https://your-project.vercel.app/admin`
- [ ] Check that admin panel loads (may show "No users found" - this is OK)

---

## Step 3: Seed Production Database (5 minutes)

### 3.1 Update Local Environment
- [ ] Open your local `.env` file
- [ ] Replace `MONGODB_URI` with production MongoDB URI from Step 1.5
- [ ] Replace `PAYLOAD_SECRET` with the same secret from Step 2.4

### 3.2 Run Seed Script
```bash
npm run seed
```

- [ ] Verify output shows:
  ```
  Created admin user: admin@demo.com
  Created reviewer user: reviewer@demo.com
  Created editor user: editor@demo.com
  Created workflow: Blog Approval Workflow
  Seeding complete!
  ```

### 3.3 Verify Users Created
- [ ] Go to `https://your-project.vercel.app/admin`
- [ ] Login with: admin@demo.com / admin123
- [ ] Should successfully login and see admin dashboard

---

## Step 4: Test Live Deployment (10 minutes)

### 4.1 Test Admin Login
- [ ] URL: `https://your-project.vercel.app/admin`
- [ ] Email: admin@demo.com
- [ ] Password: admin123
- [ ] Should see dashboard with all collections

### 4.2 Test Workflow Definition
- [ ] Navigate to "Workflow System" → "Workflow Definitions"
- [ ] Should see "Blog Approval Workflow"
- [ ] Click to view details
- [ ] Verify 2 steps are configured

### 4.3 Test Blog Creation
- [ ] Navigate to "Blogs"
- [ ] Click "Create New"
- [ ] Title: "Test Blog Post"
- [ ] Content: "This is a test blog post for workflow testing"
- [ ] Click "Save"
- [ ] Verify workflow status shows "pending" or "in-progress"
- [ ] Check if Workflow Panel appears on right side

### 4.4 Test Reviewer Login
- [ ] Logout from admin
- [ ] Login as: reviewer@demo.com / reviewer123
- [ ] Navigate to "Blogs"
- [ ] Open the test blog post
- [ ] Verify Workflow Panel shows "Approve" button
- [ ] Click "Approve"
- [ ] Verify step advances

### 4.5 Test Editor Login
- [ ] Logout from reviewer
- [ ] Login as: editor@demo.com / editor123
- [ ] Navigate to "Blogs"
- [ ] Click "Create New"
- [ ] Create another test blog
- [ ] Verify workflow is triggered
- [ ] Verify editor cannot approve (no buttons shown)

### 4.6 Test Workflow Logs
- [ ] Login as admin
- [ ] Navigate to "Workflow System" → "Workflow Logs"
- [ ] Verify logs are being created for each action
- [ ] Check that logs show: user, action, timestamp

### 4.7 Test API Endpoints

**Get JWT Token:**
```bash
curl -X POST https://your-project.vercel.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123"}'
```
- [ ] Copy the token from response

**Test Status Endpoint:**
```bash
curl https://your-project.vercel.app/api/workflows/status/DOCUMENT_ID?collection=blogs \
  -H "Authorization: Bearer YOUR_TOKEN"
```
- [ ] Replace DOCUMENT_ID with actual blog ID
- [ ] Replace YOUR_TOKEN with JWT token
- [ ] Verify response shows workflow status

---

## Step 5: Create HLD Diagram (30 minutes)

- [ ] Go to https://excalidraw.com/
- [ ] Follow instructions in `EXCALIDRAW_HLD_INSTRUCTIONS.md`
- [ ] Create all 6 layers
- [ ] Add all components and modules
- [ ] Add arrows showing data flow
- [ ] Add annotations for security and features
- [ ] Add title and your name
- [ ] Export as PNG: `HLD_Workflow_System.png`
- [ ] Alternative: Get shareable link

---

## Step 6: Prepare Submission Information

### 6.1 Gather All URLs
- [ ] Live Deployment URL: `https://your-project.vercel.app`
- [ ] Admin Panel URL: `https://your-project.vercel.app/admin`
- [ ] GitHub Repository: `https://github.com/daksh2204/payloadworkflowsystem`
- [ ] Excalidraw HLD Link: `https://excalidraw.com/#json=...`

### 6.2 Prepare Credentials Document
```
ADMIN CREDENTIALS:
Email: admin@demo.com
Password: admin123
Role: Full system access

REVIEWER CREDENTIALS:
Email: reviewer@demo.com
Password: reviewer123
Role: Review and approve assigned steps

EDITOR CREDENTIALS:
Email: editor@demo.com
Password: editor123
Role: Create content, view workflow status
```

### 6.3 Prepare System Design Summary
```
ARCHITECTURE: 6-Layer Architecture
- Client Layer: Web browsers and API clients
- Presentation Layer: React-based Payload Admin UI
- API Layer: Express.js REST API with custom endpoints
- Business Logic Layer: Workflow Engine Plugin (6 modules)
- Data Layer: Payload CMS Collections (5 collections)
- Database Layer: MongoDB Atlas

KEY FEATURES:
- Collection-agnostic workflow engine
- Unlimited workflow steps
- Role-based and user-specific assignments
- Conditional step logic (4 operators)
- Immutable audit logging
- Real-time workflow status
- RESTful APIs for integration

TECH STACK:
- Backend: Node.js, Express.js, TypeScript
- CMS: Payload CMS v2+
- Database: MongoDB with Mongoose
- Frontend: React
- Deployment: Vercel Serverless
- Testing: Jest + Property-Based Testing
```

---

## Step 7: Submit Form (5 minutes)

### 7.1 Open Form
- [ ] Go to https://forms.gle/m3CxSZKFd5xZ14U76

### 7.2 Fill Form Fields

**Field 1: Live Deployment URL**
- [ ] Enter: `https://your-project.vercel.app`

**Field 2: Admin Panel URL**
- [ ] Enter: `https://your-project.vercel.app/admin`

**Field 3: GitHub Repository**
- [ ] Enter: `https://github.com/daksh2204/payloadworkflowsystem`

**Field 4: Credentials**
- [ ] Paste the credentials from Step 6.2

**Field 5: HLD Diagram**
- [ ] Upload `HLD_Workflow_System.png`
- [ ] Or paste Excalidraw shareable link

**Field 6: System Design Description**
- [ ] Paste the system design summary from Step 6.3

**Field 7: API Documentation**
- [ ] Paste API endpoints with examples (see below)

**Field 8: Technology Stack**
- [ ] List: Node.js, TypeScript, Express.js, Payload CMS v2+, MongoDB, React, Vercel

**Field 9: Additional Notes**
- [ ] Mention: "Fully working system with role-based access control, deployed on Vercel with MongoDB Atlas. All features tested and verified on live deployment."

### 7.3 Submit
- [ ] Review all fields
- [ ] Click "Submit"
- [ ] Save confirmation

---

## API Documentation for Form

```
1. POST /api/workflows/trigger
   Description: Manually triggers workflow processing for a document
   Request Body:
   {
     "collection": "blogs",
     "documentId": "64a1b2c3d4e5f6g7h8i9j0k1"
   }
   Response:
   {
     "success": true,
     "workflowStatus": "in-progress",
     "currentStep": 1
   }

2. GET /api/workflows/status/:docId?collection=blogs
   Description: Retrieves workflow status and logs
   Response:
   {
     "workflowName": "Blog Approval Workflow",
     "currentStep": 1,
     "completedSteps": [...],
     "pendingSteps": [...],
     "logs": [...]
   }

3. POST /api/workflows/action
   Description: Executes workflow action (approve/reject/comment)
   Request Body:
   {
     "documentId": "64a1b2c3d4e5f6g7h8i9j0k1",
     "collection": "blogs",
     "action": "approve",
     "comment": "Approved"
   }
   Response:
   {
     "success": true,
     "workflowStatus": "completed",
     "currentStep": 2
   }

Authentication: All endpoints require JWT token in Authorization header
Format: Authorization: Bearer <token>
Get token via: POST /api/users/login
```

---

## Troubleshooting

### Deployment Fails
1. Check Vercel deployment logs
2. Verify all dependencies are in `dependencies` (not `devDependencies`)
3. Ensure TypeScript compiles: `npm run build`
4. Check that `dist/server.js` exists after build

### Cannot Login After Deployment
1. Verify seed script ran successfully
2. Check MongoDB Atlas connection
3. Verify PAYLOAD_SECRET is set in Vercel
4. Check Vercel function logs

### Workflow Not Working
1. Verify workflow definition exists
2. Check that blog/contract has workflow fields
3. Review workflow logs in admin panel
4. Check Vercel function logs for errors

### API Returns 401 Unauthorized
1. Get fresh JWT token via login endpoint
2. Verify token is included in Authorization header
3. Check token format: `Bearer <token>`

---

## Post-Deployment Verification

- [ ] Admin panel accessible at live URL
- [ ] All three users can login
- [ ] Workflow definitions visible
- [ ] Can create blog post
- [ ] Workflow is triggered automatically
- [ ] Can approve as reviewer
- [ ] Can approve as admin
- [ ] Workflow logs are created
- [ ] API endpoints respond correctly
- [ ] No errors in Vercel logs

---

## Timeline

| Task | Time | Status |
|------|------|--------|
| MongoDB Atlas Setup | 15 min | ⬜ |
| Vercel Deployment | 10 min | ⬜ |
| Seed Database | 5 min | ⬜ |
| Test Deployment | 10 min | ⬜ |
| Create HLD Diagram | 30 min | ⬜ |
| Submit Form | 5 min | ⬜ |
| **Total** | **75 min** | |

---

## Important Notes

1. **Do NOT use localhost** - Everything must be on live deployment
2. **Test all three roles** - Ensure each role works correctly
3. **HLD must be on Excalidraw** - No other tools accepted
4. **Include all credentials** - Evaluators need to test your system
5. **Verify before submitting** - Test everything on live URL first

---

## Success Criteria

Your submission will be successful if:

✅ Live deployment URL works and shows admin panel
✅ All three role-based users can login
✅ Workflow can be created by admin
✅ Blog post creation triggers workflow
✅ Reviewer can approve first step
✅ Admin can approve final step
✅ Workflow logs are visible
✅ HLD diagram clearly shows system architecture
✅ All API endpoints work with authentication

---

## Contact Information for Submission

**Submission Form**: https://forms.gle/m3CxSZKFd5xZ14U76

**Your Details:**
- Name: [Your Name]
- Email: [Your Email]
- GitHub: daksh2204
- Repository: payloadworkflowsystem

---

## Final Check

Before clicking submit:

1. ✅ Can you access the live admin panel?
2. ✅ Can you login with all three accounts?
3. ✅ Can you create a blog and see workflow triggered?
4. ✅ Can you approve steps with different roles?
5. ✅ Is your HLD diagram complete and clear?
6. ✅ Have you tested all API endpoints?

If all answers are YES, you're ready to submit! 🚀

