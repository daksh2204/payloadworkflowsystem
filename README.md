# Dynamic Workflow Management System for Payload CMS

A flexible, production-ready workflow engine for Payload CMS v2+ that enables multi-step approval processes for any collection. Built with TypeScript, MongoDB, and Express.

## Features

- **Unlimited Workflow Steps**: Create workflows with any number of approval stages
- **Role-Based & User-Specific Assignments**: Assign steps to specific users or roles
- **Conditional Logic**: Define conditions to skip or include steps based on document data
- **Immutable Audit Logging**: Complete audit trail for compliance
- **Dynamic Admin UI**: React-based workflow panel integrated into Payload admin
- **REST APIs**: Trigger and query workflows programmatically
- **Collection-Agnostic**: Works with any Payload collection
- **TypeScript**: Full type safety throughout

## Architecture

The system consists of:
- **Workflow Engine Plugin**: Core workflow orchestration
- **Condition Evaluator**: Evaluates step conditions
- **Workflow Logger**: Creates immutable audit logs
- **Trigger Hooks**: Automatically initiates workflows on document changes
- **API Endpoints**: REST APIs for workflow operations
- **React Components**: Admin UI for workflow interaction

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/payload-workflow
PAYLOAD_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=development
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Seed demo data (creates users and sample workflow):
```bash
npm run seed
```

3. Start development server:
```bash
npm run dev
```

4. Access admin panel:
```
http://localhost:3000/admin
```

## Demo Credentials

- **Admin**: admin@demo.com / admin123
- **Reviewer**: reviewer@demo.com / reviewer123

## Project Structure

```
src/
├── collections/          # Payload collections
│   ├── Blogs.ts
│   ├── Contracts.ts
│   ├── WorkflowDefinitions.ts
│   └── WorkflowLogs.ts
├── plugins/
│   └── workflowEngine/   # Workflow engine plugin
│       ├── engine.ts     # Core workflow logic
│       ├── actions.ts    # Workflow actions
│       ├── logger.ts     # Audit logging
│       ├── hooks.ts      # Payload hooks
│       ├── notifications.ts
│       └── endpoints/    # API endpoints
├── utils/
│   └── conditionEvaluator.ts
├── components/
│   └── WorkflowPanel.tsx # Admin UI component
├── types/                # TypeScript interfaces
├── payload.config.ts     # Payload configuration
└── server.ts             # Express server
```


## API Endpoints

### POST /api/workflows/trigger
Manually triggers workflow processing for a document.

**Request:**
```json
{
  "collection": "blogs",
  "documentId": "64a1b2c3d4e5f6g7h8i9j0k1"
}
```

**Response:**
```json
{
  "success": true,
  "workflowStatus": "in-progress",
  "currentStep": 1,
  "message": "Workflow processing initiated"
}
```

### GET /api/workflows/status/:docId?collection=blogs
Retrieves workflow status and logs for a document.

**Response:**
```json
{
  "workflowName": "Blog Approval Workflow",
  "currentStep": 1,
  "completedSteps": [...],
  "pendingSteps": [...],
  "logs": [...]
}
```

### POST /api/workflows/action
Executes a workflow action (approve, reject, comment).

**Request:**
```json
{
  "documentId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "collection": "blogs",
  "action": "approve",
  "comment": "Looks good!"
}
```

## Creating Custom Workflows

1. Navigate to **Workflow System > Workflow Definitions** in admin
2. Click **Create New**
3. Configure:
   - **Name**: Workflow name
   - **Collection Slug**: Target collection (e.g., "blogs")
   - **Steps**: Add workflow steps with:
     - Step Name
     - Step Type (approval, review, sign-off, comment)
     - Order (sequential number)
     - Assigned Role or User
     - Optional conditions (field, operator, value)

## Adding Workflow Support to Collections

Add these fields to any collection:

```typescript
{
  name: 'workflowStatus',
  type: 'select',
  required: true,
  defaultValue: 'pending',
  options: [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Rejected', value: 'rejected' },
  ],
  admin: {
    readOnly: true,
  },
},
{
  name: 'currentWorkflowStep',
  type: 'number',
  required: true,
  defaultValue: 0,
  admin: {
    readOnly: true,
  },
}
```

## Deployment to Vercel

1. Build the project:
```bash
npm run build
```

2. Configure environment variables in Vercel:
   - `MONGODB_URI`
   - `PAYLOAD_SECRET`
   - `NODE_ENV=production`

3. Deploy:
```bash
vercel deploy
```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## License

MIT
