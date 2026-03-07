# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The `.env` file has been created with default values. Update if needed:

```env
MONGODB_URI=mongodb://localhost:27017/payload-workflow
PAYLOAD_SECRET=your-secret-key-here-change-in-production
PORT=3000
NODE_ENV=development
```

### 3. Seed Demo Data

This creates demo users and a sample workflow:

```bash
npm run seed
```

This will create:
- Admin user: admin@demo.com / admin123
- Reviewer user: reviewer@demo.com / reviewer123
- Blog Approval Workflow (2 steps)

### 4. Start Development Server

```bash
npm run dev
```

The server will start on http://localhost:3000

### 5. Access Admin Panel

Open your browser and navigate to:
```
http://localhost:3000/admin
```

Login with:
- Email: admin@demo.com
- Password: admin123

## Testing the Workflow

### 1. Create a Blog Post

1. Navigate to **Blogs** in the admin panel
2. Click **Create New**
3. Fill in:
   - Title: "My First Blog Post"
   - Content: "This is a test blog post"
4. Click **Save**

The workflow will automatically initialize with status "pending"

### 2. Review the Blog (as Reviewer)

1. Logout and login as reviewer@demo.com / reviewer123
2. Navigate to **Blogs**
3. Open the blog post you created
4. The workflow panel will show the current step
5. Click **Approve** to move to the next step

### 3. Final Approval (as Admin)

1. Logout and login as admin@demo.com / admin123
2. Navigate to **Blogs**
3. Open the same blog post
4. Click **Approve** to complete the workflow

The workflow status will change to "completed"

### 4. View Workflow Logs

Navigate to **Workflow System > Workflow Logs** to see the complete audit trail

## Creating Custom Workflows

### 1. Create a Workflow Definition

1. Navigate to **Workflow System > Workflow Definitions**
2. Click **Create New**
3. Configure:
   - Name: "Contract Approval"
   - Collection Slug: "contracts"
   - Steps:
     - Step 1: Review by reviewer (order: 1)
     - Step 2: Approval by admin (order: 2)

### 2. Add Conditional Steps

You can add conditions to steps:
- Condition Field: "amount"
- Condition Operator: ">"
- Condition Value: "10000"

This step will only execute if the contract amount is greater than 10,000

## API Testing

### Trigger Workflow Manually

```bash
curl -X POST http://localhost:3000/api/workflows/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "blogs",
    "documentId": "YOUR_DOCUMENT_ID"
  }'
```

### Check Workflow Status

```bash
curl http://localhost:3000/api/workflows/status/YOUR_DOCUMENT_ID?collection=blogs
```

## Troubleshooting

### MongoDB Connection Error

Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod

# Or check if MongoDB service is running
```

### Port Already in Use

Change the PORT in `.env` file:
```env
PORT=3001
```

### TypeScript Errors

Rebuild the project:
```bash
npm run build
```

## Next Steps

- Explore the codebase in `src/` directory
- Read the full README.md for detailed documentation
- Check the design document in `.kiro/specs/payload-workflow-system/design.md`
- Add workflow support to your own collections
- Customize the workflow panel UI

## Support

For issues or questions, refer to:
- README.md - Full documentation
- Design document - Architecture details
- Requirements document - Feature specifications
