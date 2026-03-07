# Installation & Usage Guide

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- MongoDB running locally OR MongoDB Atlas account
- Git (optional, for version control)

## Step-by-Step Installation

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Payload CMS v2+
- MongoDB adapter
- Express server
- TypeScript and type definitions
- Testing libraries (Jest, fast-check)
- Development tools (nodemon, ts-node)

### 2. Configure Environment Variables

The `.env` file has been created with default values. Update it with your settings:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/payload-workflow

# Payload CMS Secret (change this!)
PAYLOAD_SECRET=your-secret-key-here-change-in-production

# Server Port
PORT=3000

# Node Environment
NODE_ENV=development
```

**Important**: Change `PAYLOAD_SECRET` to a secure random string in production!

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start MongoDB

If using local MongoDB:
```bash
mongod
```

Or ensure your MongoDB Atlas cluster is accessible.

### 4. Seed Demo Data

Create demo users and sample workflow:

```bash
npm run seed
```

This creates:
- **Admin user**: admin@demo.com / admin123 (role: admin)
- **Reviewer user**: reviewer@demo.com / reviewer123 (role: reviewer)
- **Blog Approval Workflow**: 2-step approval process

### 5. Start Development Server

```bash
npm run dev
```

The server will start on http://localhost:3000

You should see:
```
Payload CMS initialized
Admin URL: http://localhost:3000/admin
Server listening on port 3000
```

### 6. Access Admin Panel

Open your browser and navigate to:
```
http://localhost:3000/admin
```

Login with:
- Email: `admin@demo.com`
- Password: `admin123`

## Usage Examples

### Example 1: Create and Approve a Blog Post

#### Step 1: Create Blog Post (as Admin)

1. Navigate to **Blogs** in the sidebar
2. Click **Create New**
3. Fill in:
   - Title: "My First Blog Post"
   - Content: "This is a test blog post with workflow"
4. Click **Save**

Notice:
- workflowStatus is automatically set to "pending"
- currentWorkflowStep is set to 0
- Workflow panel appears on the right

#### Step 2: Review (as Reviewer)

1. Logout (top right menu)
2. Login as reviewer@demo.com / reviewer123
3. Navigate to **Blogs**
4. Open the blog post you created
5. In the Workflow Panel:
   - See "Blog Approval Workflow"
   - Current step: "Review" (⏳ pending icon)
   - Action buttons: Approve, Reject, Comment
6. Add comment: "Content looks great!"
7. Click **Approve**

Notice:
- Workflow advances to step 2
- Log entry created with your approval
- Console shows email simulation

#### Step 3: Final Approval (as Admin)

1. Logout and login as admin@demo.com / admin123
2. Navigate to **Blogs**
3. Open the same blog post
4. In the Workflow Panel:
   - Step 1 shows ✔ (completed)
   - Step 2 shows ⏳ (current)
   - See reviewer's approval in logs
5. Click **Approve**

Notice:
- Workflow status changes to "completed"
- Both steps show ✔
- Complete audit trail in logs

### Example 2: Create a Custom Workflow

#### Create Contract Approval Workflow with Conditions

1. Login as admin
2. Navigate to **Workflow System > Workflow Definitions**
3. Click **Create New**
4. Configure:
   - Name: "High-Value Contract Approval"
   - Collection Slug: "contracts"
5. Add Step 1:
   - Step Name: "Initial Review"
   - Step Type: "review"
   - Order: 1
   - Assigned Role: "reviewer"
6. Add Step 2 (conditional):
   - Step Name: "Executive Approval"
   - Step Type: "approval"
   - Order: 2
   - Assigned Role: "admin"
   - Condition Field: "amount"
   - Condition Operator: ">"
   - Condition Value: "10000"
7. Add Step 3:
   - Step Name: "Final Sign-off"
   - Step Type: "sign-off"
   - Order: 3
   - Assigned Role: "admin"
8. Click **Save**

Now test it:
- Create a contract with amount 5000 → Step 2 is skipped
- Create a contract with amount 15000 → Step 2 is executed

### Example 3: Using the API

#### Trigger Workflow Manually

```bash
curl -X POST http://localhost:3000/api/workflows/trigger \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "collection": "blogs",
    "documentId": "65f1a2b3c4d5e6f7g8h9i0j1"
  }'
```

Response:
```json
{
  "success": true,
  "workflowStatus": "in-progress",
  "currentStep": 1,
  "message": "Workflow processing initiated"
}
```

#### Check Workflow Status

```bash
curl http://localhost:3000/api/workflows/status/65f1a2b3c4d5e6f7g8h9i0j1?collection=blogs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "workflowName": "Blog Approval Workflow",
  "currentStep": 1,
  "completedSteps": [...],
  "pendingSteps": [...],
  "logs": [...]
}
```

#### Execute Workflow Action

```bash
curl -X POST http://localhost:3000/api/workflows/action \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "documentId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "collection": "blogs",
    "action": "approve",
    "comment": "Approved for publication"
  }'
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Specific Test File

```bash
npm test -- workflow-properties.test.ts
```

## Building for Production

### Build TypeScript

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Start Production Server

```bash
npm start
```

## Troubleshooting

### Issue: MongoDB Connection Error

**Solution**: Ensure MongoDB is running and MONGODB_URI is correct

```bash
# Check if MongoDB is running
mongod --version

# Test connection
mongo mongodb://localhost:27017/payload-workflow
```

### Issue: Port Already in Use

**Solution**: Change PORT in `.env` file

```env
PORT=3001
```

### Issue: TypeScript Compilation Errors

**Solution**: Rebuild the project

```bash
rm -rf dist/
npm run build
```

### Issue: Workflow Not Triggering

**Solution**: Verify:
1. Collection has workflowStatus and currentWorkflowStep fields
2. Workflow definition exists for that collection
3. Check console for error messages

### Issue: Unauthorized to Perform Action

**Solution**: Verify:
1. User is logged in
2. User has correct role or is assigned to current step
3. Check workflow step assignments

## Advanced Configuration

### Custom Workflow Plugin Config

```typescript
workflowPlugin({
  enabled: true,
  collections: ['blogs', 'contracts'], // Restrict to specific collections
  notificationHandler: customEmailHandler,
})
```

### Database Indexes

For better performance, add indexes:

```javascript
db.workflow_logs.createIndex({ collectionSlug: 1, documentId: 1, timestamp: -1 });
db.workflow_definitions.createIndex({ collectionSlug: 1 });
```

### Rate Limiting

Add rate limiting to API endpoints:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use('/api/workflows/', limiter);
```

## Monitoring

### Console Logs

Watch for:
- `[EMAIL SIMULATION]` - Workflow notifications
- `[Workflow Engine Error]` - Processing errors
- `[Workflow Hook Error]` - Hook execution errors

### Workflow Logs Collection

Monitor the Workflow Logs collection for:
- Unusual activity patterns
- Failed actions
- Authorization errors

### Health Check

Add a health check endpoint:

```bash
curl http://localhost:3000/api/health
```

## Getting Help

If you encounter issues:
1. Check the console logs
2. Review the Workflow Logs collection
3. Verify environment variables
4. Check MongoDB connection
5. Review the README.md and DEPLOYMENT.md

## What's Next?

- Add workflow support to your own collections
- Customize the workflow panel UI
- Integrate real email notifications
- Add more workflow step types
- Implement workflow templates
- Add workflow analytics dashboard

Enjoy building with the Dynamic Workflow Management System! 🚀
