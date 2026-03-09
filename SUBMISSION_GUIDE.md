# WeframeTech Backend Internship - Resubmission Guide

## Overview

This guide contains everything you need to complete the resubmission for the WeframeTech Backend Internship task.

## ✅ Checklist

- [ ] Deploy project to Vercel (live URL)
- [ ] Set up MongoDB Atlas database
- [ ] Seed demo data with all role-based users
- [ ] Create HLD diagram on Excalidraw
- [ ] Test all features on live deployment
- [ ] Submit form with all details

---

## 1. Deploy to Vercel (Live Deployment)

### Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account (if you don't have one)
3. Create a new cluster (M0 Free tier is sufficient)
4. Create a database user:
   - Username: `payloaduser`
   - Password: Generate a strong password (save it!)
5. Network Access: Add `0.0.0.0/0` (allow access from anywhere)
6. Get your connection string:
   ```
   mongodb+srv://payloaduser:<password>@cluster0.xxxxx.mongodb.net/payload-workflow?retryWrites=true&w=majority
   ```
   Replace `<password>` with your actual password

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository: `daksh2204/payloadworkflowsystem`
5. Configure project:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Add Environment Variables (CRITICAL):
   ```
   MONGODB_URI=mongodb+srv://payloaduser:<password>@cluster0.xxxxx.mongodb.net/payload-workflow?retryWrites=true&w=majority
   PAYLOAD_SECRET=your-super-secret-key-min-32-chars-long-random-string
   NODE_ENV=production
   ```

7. Click "Deploy"

### Step 3: Seed Production Database

After deployment succeeds, you need to seed the database with demo users and workflows.

**Option A: Run seed script locally pointing to production DB**

1. Update your local `.env` file with production MongoDB URI:
   ```env
   MONGODB_URI=mongodb+srv://payloaduser:<password>@cluster0.xxxxx.mongodb.net/payload-workflow
   PAYLOAD_SECRET=your-super-secret-key-min-32-chars-long-random-string
   ```

2. Run seed script:
   ```bash
   npm run seed
   ```

**Option B: Use Vercel CLI**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Link project:
   ```bash
   vercel link
   ```

4. Run seed command:
   ```bash
   vercel env pull .env.production
   npm run seed
   ```

### Step 4: Verify Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app/admin`
2. Login with admin credentials
3. Check that collections are visible
4. Create a test blog post
5. Verify workflow is triggered

---

## 2. Role-Based Credentials

### Demo User Accounts

The system includes three role-based user accounts:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | admin@demo.com | admin123 | Full access: Create/edit workflows, approve all steps, manage all collections |
| **Reviewer** | reviewer@demo.com | reviewer123 | Review access: Can review and approve assigned review steps |
| **Editor** | editor@demo.com | editor123 | Basic access: Can create blogs/contracts, view workflow status |

### Role Capabilities

**Admin Role:**
- Create and manage workflow definitions
- Approve/reject any workflow step
- View all workflow logs
- Manage all collections (blogs, contracts, users)
- Full CRUD on all resources

**Reviewer Role:**
- Review and approve assigned review steps
- Add comments to workflows
- View workflow logs
- Create and edit blogs/contracts
- Cannot create workflow definitions

**Editor Role:**
- Create blogs and contracts
- View workflow status on their documents
- Add comments to workflows
- Cannot approve/reject steps
- Cannot create workflow definitions

---

## 3. High-Level Design (HLD)

### Create HLD Diagram on Excalidraw

Go to https://excalidraw.com/ and create a diagram with these components:

#### Layer 1: Client Layer (Top)
- Rectangle labeled "Web Browser / External API Clients"
- Color: Light blue

#### Layer 2: Presentation Layer
- Rectangle labeled "Payload Admin UI (React)"
- Inside, add 4 smaller boxes:
  - WorkflowPanel Component
  - WorkflowProgress Component
  - WorkflowActions Component
  - WorkflowLogViewer Component
- Color: Light green

#### Layer 3: API Layer
- Rectangle labeled "Express.js REST API Server"
- Inside, list endpoints:
  - POST /api/workflows/trigger
  - GET /api/workflows/status/:docId
  - POST /api/workflows/action
  - Payload Built-in APIs
- Color: Light orange

#### Layer 4: Business Logic Layer
- Large rectangle labeled "Workflow Engine Plugin"
- Inside, add 6 modules:
  - Core Engine (processWorkflow, findNextEligibleStep)
  - Actions Module (approve, reject, comment)
  - Hooks Module (afterChange, beforeChange)
  - Logger Module (createLog, getLogs)
  - Condition Evaluator (evaluateCondition)
  - Notification Module (sendNotification)
- Color: Light purple

#### Layer 5: Data Layer
- Rectangle labeled "Payload CMS Collections"
- Inside, add 5 boxes:
  - WorkflowDefinitions
  - WorkflowLogs
  - Users
  - Blogs
  - Contracts
- Color: Light yellow

#### Layer 6: Database Layer
- Rectangle labeled "MongoDB Database (Atlas)"
- Color: Light gray

#### Add Arrows (Data Flow):
1. Client → Admin UI (HTTPS)
2. Admin UI → API Layer (REST Calls)
3. API Layer → Business Logic (Function Calls)
4. Business Logic → Data Layer (CRUD Operations)
5. Data Layer → Database (Mongoose ODM)

#### Add Side Annotations:
- Left side: "Authentication: JWT Tokens"
- Right side: "Authorization: RBAC + User-Specific"
- Bottom: "Audit Trail: Immutable Logs"

#### Add a separate flow diagram showing:
**Workflow Execution Flow:**
```
Document Created → Hook Triggered → Find Workflow → Evaluate Conditions → 
Assign Step → Create Log → Send Notification → Update Status
```

### Export Diagram
- File → Export Image → PNG
- Save as `HLD_Workflow_System.png`

---

## 4. Testing the Live Deployment

### Test Scenario 1: Admin Creates Workflow

1. Login as admin@demo.com / admin123
2. Navigate to "Workflow System" → "Workflow Definitions"
3. Create new workflow:
   - Name: "Contract Approval Workflow"
   - Collection Slug: "contracts"
   - Steps:
     - Step 1: Review by reviewer (order: 1)
     - Step 2: Approval by admin (order: 2)
4. Save workflow

### Test Scenario 2: Editor Creates Document

1. Logout and login as editor@demo.com / editor123
2. Navigate to "Blogs"
3. Create new blog:
   - Title: "Test Blog Post"
   - Content: "This is a test blog post"
4. Save blog
5. Verify workflow status shows "pending" or "in-progress"

### Test Scenario 3: Reviewer Approves Step

1. Logout and login as reviewer@demo.com / reviewer123
2. Navigate to "Blogs"
3. Open the test blog post
4. In the Workflow Panel (right side), click "Approve"
5. Verify step advances to next stage

### Test Scenario 4: Admin Final Approval

1. Logout and login as admin@demo.com / admin123
2. Navigate to "Blogs"
3. Open the test blog post
4. In the Workflow Panel, click "Approve"
5. Verify workflow status changes to "completed"

### Test Scenario 5: API Testing

Use Postman or curl to test APIs:

```bash
# Get workflow status
curl https://your-project.vercel.app/api/workflows/status/DOCUMENT_ID?collection=blogs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Trigger workflow manually
curl -X POST https://your-project.vercel.app/api/workflows/trigger \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"collection":"blogs","documentId":"DOCUMENT_ID"}'
```

---

## 5. Form Submission Details

### Information to Submit

**Form URL**: https://forms.gle/m3CxSZKFd5xZ14U76

**Details to Include:**

1. **Live Deployment URL**
   - Format: `https://your-project.vercel.app`
   - Admin Panel: `https://your-project.vercel.app/admin`

2. **GitHub Repository**
   - URL: `https://github.com/daksh2204/payloadworkflowsystem`

3. **Role-Based Credentials**
   ```
   Admin:
   Email: admin@demo.com
   Password: admin123
   
   Reviewer:
   Email: reviewer@demo.com
   Password: reviewer123
   
   Editor:
   Email: editor@demo.com
   Password: editor123
   ```

4. **HLD Diagram**
   - Upload the PNG exported from Excalidraw
   - Or share Excalidraw link (File → Share → Get shareable link)

5. **System Design Description**
   ```
   The system uses a 6-layer architecture:
   
   1. Client Layer: Web browsers and external API consumers
   2. Presentation Layer: React-based Payload Admin UI with custom workflow components
   3. API Layer: Express.js REST API with custom workflow endpoints
   4. Business Logic Layer: Workflow Engine plugin with 6 core modules
   5. Data Layer: Payload CMS collections (5 collections)
   6. Database Layer: MongoDB Atlas for data persistence
   
   Key Features:
   - Collection-agnostic workflow engine
   - Role-based and user-specific step assignments
   - Conditional step logic with 4 operators
   - Immutable audit logging for compliance
   - Real-time workflow status updates
   - RESTful APIs for external integration
   
   Technology Stack:
   - Backend: Node.js, Express.js, TypeScript
   - CMS: Payload CMS v2+
   - Database: MongoDB with Mongoose ODM
   - Frontend: React (Payload Admin UI)
   - Deployment: Vercel Serverless
   - Testing: Jest + Property-Based Testing (fast-check)
   ```

6. **API Documentation**
   ```
   POST /api/workflows/trigger
   - Manually triggers workflow processing
   - Body: { collection, documentId }
   
   GET /api/workflows/status/:docId?collection=blogs
   - Retrieves workflow status and logs
   - Returns: workflow name, steps, logs
   
   POST /api/workflows/action
   - Executes workflow action (approve/reject/comment)
   - Body: { documentId, collection, action, comment }
   ```

---

## 6. Common Deployment Issues & Solutions

### Issue 1: Build Fails on Vercel
**Solution**: Ensure all dependencies are in `dependencies` (not `devDependencies`)

### Issue 2: MongoDB Connection Fails
**Solution**: 
- Verify connection string format
- Check MongoDB Atlas network access (0.0.0.0/0)
- Ensure database user has read/write permissions

### Issue 3: Admin Panel Shows 404
**Solution**: 
- Verify vercel.json routes configuration
- Check that build output is in `dist/` folder
- Ensure `dist/server.js` exists after build

### Issue 4: Seed Script Fails
**Solution**:
- Run seed script locally with production MongoDB URI
- Check that PAYLOAD_SECRET matches between seed and deployment
- Verify MongoDB connection string is correct

---

## 7. Quick Deployment Commands

```bash
# 1. Build project
npm run build

# 2. Install Vercel CLI
npm install -g vercel

# 3. Login to Vercel
vercel login

# 4. Deploy to production
vercel --prod

# 5. Seed database (update .env with production MongoDB first)
npm run seed
```

---

## 8. Video Demo Script (Optional but Recommended)

If you want to create a quick Loom video:

1. **Introduction (30 seconds)**
   - "Hi, I'm [Your Name], and this is my Dynamic Workflow Management System for Payload CMS"
   - Show GitHub repository

2. **Architecture Overview (1 minute)**
   - Show HLD diagram
   - Explain 6-layer architecture
   - Mention key technologies

3. **Live Demo (3 minutes)**
   - Login as admin → Create workflow
   - Login as editor → Create blog post
   - Login as reviewer → Approve step
   - Login as admin → Final approval
   - Show workflow logs

4. **API Demo (1 minute)**
   - Use Postman to call workflow status API
   - Show JSON response

5. **Code Walkthrough (1 minute)**
   - Show workflow engine plugin structure
   - Highlight collection-agnostic design
   - Show TypeScript types

---

## 9. Key Points to Emphasize in Submission

1. **Not AI-Generated Without Understanding**
   - Explain the plugin architecture
   - Describe how conditional logic works
   - Explain the collection-agnostic design pattern

2. **Production-Ready**
   - TypeScript strict mode enabled
   - Error handling on all endpoints
   - Immutable audit logs for compliance
   - Role-based access control

3. **Proper System Design**
   - Modular architecture (6 modules in workflow engine)
   - Separation of concerns (engine, actions, logger, hooks)
   - Scalable design (serverless + MongoDB Atlas)
   - RESTful API design

4. **Live Deployment**
   - Deployed on Vercel (not localhost)
   - Connected to MongoDB Atlas
   - Accessible via public URL
   - All features working end-to-end

---

## 10. Final Checklist Before Submission

- [ ] Vercel deployment is live and accessible
- [ ] Admin panel loads at `/admin`
- [ ] All three users can login (admin, reviewer, editor)
- [ ] Sample workflow exists in Workflow Definitions
- [ ] Can create blog post and see workflow triggered
- [ ] Can approve steps as reviewer and admin
- [ ] Workflow logs are being created
- [ ] HLD diagram is created on Excalidraw
- [ ] HLD diagram is exported as PNG or shareable link
- [ ] Form is filled with all required information

---

## Need Help?

If you encounter issues during deployment:

1. Check Vercel deployment logs
2. Verify MongoDB Atlas connection
3. Test locally with production MongoDB URI first
4. Check that all environment variables are set correctly
5. Ensure build completes successfully before deploying

