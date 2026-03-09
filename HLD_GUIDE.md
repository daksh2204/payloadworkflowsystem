# High-Level Design - Quick Guide

## Create on Excalidraw.com

### Step 1: Open https://excalidraw.com/

### Step 2: Create These Boxes (Top to Bottom)

**Box 1: Client** (Blue)
```
Client Layer
─────────────
Web Browsers | API Clients
```

**Box 2: UI** (Green)
```
Payload Admin UI (React)
────────────────────────
[WorkflowPanel] [WorkflowProgress] [WorkflowActions] [WorkflowLogViewer]
```

**Box 3: API** (Orange)
```
Express.js REST API
───────────────────
POST /api/workflows/trigger
GET /api/workflows/status/:docId
POST /api/workflows/action
```

**Box 4: Workflow Engine** (Purple - Largest)
```
Workflow Engine Plugin
──────────────────────
[Core Engine]  [Actions]  [Hooks]
[Logger]  [Condition Evaluator]  [Notifications]
```

**Box 5: Collections** (Yellow)
```
Payload CMS Collections
───────────────────────
[WorkflowDefinitions] [WorkflowLogs] [Users] [Blogs] [Contracts]
```

**Box 6: Database** (Gray)
```
MongoDB Database
────────────────
Mongoose ODM
```

### Step 3: Add Arrows
- Client → UI → API → Engine → Collections → Database

### Step 4: Add Labels
- Left: "Security: JWT + RBAC"
- Right: "Features: Multi-step Workflows"
- Bottom: "Tech: Node.js | TypeScript | MongoDB | React"

### Step 5: Export
- File → Export Image → PNG
- Save as `system-architecture.png`

---

## System Description (For Form)

```
ARCHITECTURE:
6-layer architecture with clear separation of concerns:
- Client Layer: Web browsers and API consumers
- Presentation Layer: React-based admin UI with workflow components
- API Layer: Express.js REST endpoints
- Business Logic: Workflow engine plugin with 6 modules
- Data Layer: Payload CMS collections
- Database: MongoDB for persistence

FEATURES:
- Multi-step approval workflows
- Role-based access control (Admin, Reviewer, Editor)
- Conditional step logic with 4 operators
- Immutable audit logging
- Real-time workflow status
- RESTful APIs

TECH STACK:
Node.js, TypeScript, Express.js, Payload CMS v2+, MongoDB, React, Vercel
```

