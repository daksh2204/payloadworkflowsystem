# Payload CMS Workflow Management System

A production-ready workflow engine for Payload CMS v2+ that enables multi-step approval processes for any collection.

## Features

- Multi-step approval workflows
- Role-based and user-specific assignments
- Conditional step logic
- Immutable audit logging
- Admin UI integration
- REST API endpoints

## Tech Stack

- Node.js + Express.js
- Payload CMS v2+
- TypeScript
- MongoDB
- React

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/payload-workflow
PAYLOAD_SECRET=your-secret-key
PORT=3000
NODE_ENV=development
```

## Usage

Start development server:
```bash
npm run dev
```

Seed demo data:
```bash
npm run seed
```

Build for production:
```bash
npm run build
```

## Demo Credentials

```
Admin:    admin@demo.com / admin123
Reviewer: reviewer@demo.com / reviewer123
Editor:   editor@demo.com / editor123
```

## API Endpoints

### POST /api/workflows/trigger
Trigger workflow processing for a document.

```json
{
  "collection": "blogs",
  "documentId": "..."
}
```

### GET /api/workflows/status/:docId
Get workflow status and logs.

Query params: `?collection=blogs`

### POST /api/workflows/action
Execute workflow action (approve/reject/comment).

```json
{
  "documentId": "...",
  "collection": "blogs",
  "action": "approve",
  "comment": "Looks good"
}
```

## Project Structure

```
src/
├── collections/          # Payload collections
├── plugins/
│   └── workflowEngine/   # Workflow engine plugin
├── components/           # React UI components
├── utils/                # Utilities
├── types/                # TypeScript types
├── payload.config.ts
└── server.ts
```

## Deployment

See `DEPLOYMENT.md` for Vercel deployment instructions.

## License

MIT

