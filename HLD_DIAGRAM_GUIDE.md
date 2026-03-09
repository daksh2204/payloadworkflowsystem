# High-Level Design (HLD) - Dynamic Workflow Management System

## System Overview

This document provides the High-Level Design for the Dynamic Workflow Management System built on Payload CMS v2+. Use this guide to create the HLD diagram on Excalidraw.

## Architecture Diagram Components

### 1. Client Layer (Top)
```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
├─────────────────────────────────────────────────────────┤
│  • Web Browser (Admin Users)                            │
│  • External Systems (API Consumers)                     │
└─────────────────────────────────────────────────────────┘
```

### 2. Presentation Layer
```
┌─────────────────────────────────────────────────────────┐
│              PAYLOAD ADMIN UI (React)                    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Workflow     │  │ Workflow     │  │ Workflow     │ │
│  │ Panel        │  │ Progress     │  │ Actions      │ │
│  │ Component    │  │ Component    │  │ Component    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐                                      │
│  │ Workflow Log │                                      │
│  │ Viewer       │                                      │
│  └──────────────┘                                      │
└─────────────────────────────────────────────────────────┘
```

### 3. API Layer
```
┌─────────────────────────────────────────────────────────┐
│                  EXPRESS.JS SERVER                       │
├─────────────────────────────────────────────────────────┤
│  REST API Endpoints:                                    │
│  • POST /api/workflows/trigger                          │
│  • GET  /api/workflows/status/:docId                    │
│  • POST /api/workflows/action                           │
│                                                          │
│  Payload CMS Built-in APIs:                             │
│  • /api/blogs                                           │
│  • /api/contracts                                       │
│  • /api/workflow-definitions                            │
│  • /api/workflow-logs                                   │
└─────────────────────────────────────────────────────────┘
```

### 4. Business Logic Layer
```
┌─────────────────────────────────────────────────────────┐
│              WORKFLOW ENGINE PLUGIN                      │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐  │
│  │         Core Engine (engine.ts)                  │  │
│  │  • processWorkflow()                             │  │
│  │  • findNextEligibleStep()                        │  │
│  │  • updateDocumentWorkflowState()                 │  │
│  │  • isUserAuthorizedForStep()                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Actions      │  │ Hooks        │  │ Logger       │ │
│  │ Module       │  │ Module       │  │ Module       │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │ Condition    │  │ Notification │                    │
│  │ Evaluator    │  │ Module       │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### 5. Data Layer
```
┌─────────────────────────────────────────────────────────┐
│                  PAYLOAD CMS COLLECTIONS                 │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Workflow     │  │ Workflow     │  │ Users        │ │
│  │ Definitions  │  │ Logs         │  │ Collection   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │ Blogs        │  │ Contracts    │                    │
│  │ Collection   │  │ Collection   │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### 6. Database Layer
```
┌─────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                      │
├─────────────────────────────────────────────────────────┤
│  Collections:                                           │
│  • users                                                │
│  • workflow-definitions                                 │
│  • workflow-logs                                        │
│  • blogs                                                │
│  • contracts                                            │
└─────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Flow 1: Document Creation with Workflow Trigger

```
User Creates Document
        ↓
Payload CMS API (POST /api/blogs)
        ↓
afterChange Hook Triggered
        ↓
Workflow Engine: processWorkflow()
        ↓
Find Matching Workflow Definition
        ↓
Evaluate First Step Conditions
        ↓
Assign Step to User/Role
        ↓
Create Workflow Log
        ↓
Send Notification (Console)
        ↓
Update Document Status
        ↓
Return Response to User
```

### Flow 2: Workflow Action Execution

```
User Clicks "Approve" Button
        ↓
POST /api/workflows/action
        ↓
Validate User Authorization
        ↓
Execute Workflow Action
        ↓
Create Workflow Log Entry
        ↓
Find Next Eligible Step
        ↓
Evaluate Step Conditions
        ↓
Update Document State
        ↓
Send Notification to Next Assignee
        ↓
Return Updated Status
        ↓
UI Refreshes Workflow Panel
```

### Flow 3: Conditional Step Evaluation

```
Process Workflow Step
        ↓
Check if Step has Condition
        ↓
    ┌───────┴───────┐
    │               │
No Condition    Has Condition
    │               │
    │          Evaluate Condition
    │               │
    │          ┌────┴────┐
    │          │         │
    │      True      False
    │          │         │
    │     Assign    Skip Step
    │     Step      Continue
    │          │         │
    └──────────┴─────────┘
              │
    Update Document State
```

## Component Interactions

### Workflow Engine Core Components

1. **Engine Module** (engine.ts)
   - Orchestrates workflow processing
   - Manages step transitions
   - Coordinates with other modules

2. **Actions Module** (actions.ts)
   - Handles approve/reject/comment actions
   - Validates user authorization
   - Triggers state updates

3. **Hooks Module** (hooks.ts)
   - Listens to document changes
   - Triggers workflow processing
   - Validates state transitions

4. **Logger Module** (logger.ts)
   - Creates immutable audit logs
   - Queries historical logs
   - Ensures compliance

5. **Condition Evaluator** (conditionEvaluator.ts)
   - Evaluates step conditions
   - Supports multiple operators
   - Handles type coercion

6. **Notification Module** (notifications.ts)
   - Simulates email notifications
   - Logs notification events
   - Extensible for real email integration

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  SECURITY LAYERS                         │
├─────────────────────────────────────────────────────────┤
│  1. Authentication (Payload JWT)                        │
│     • User login required for all operations            │
│     • JWT token validation                              │
│                                                          │
│  2. Authorization (Role-Based Access Control)           │
│     • Admin: Full workflow definition management        │
│     • Reviewer: Assigned step actions only              │
│     • Editor: Document creation only                    │
│                                                          │
│  3. Collection-Level Access Control                     │
│     • Workflow Definitions: Admin only                  │
│     • Workflow Logs: Create-only, no updates/deletes    │
│     • Blogs/Contracts: Role-based CRUD                  │
│                                                          │
│  4. Step-Level Authorization                            │
│     • User-specific assignments                         │
│     • Role-based assignments                            │
│     • Authorization validation before actions           │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    VERCEL PLATFORM                       │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐  │
│  │         Serverless Functions                     │  │
│  │  • Express.js Server                             │  │
│  │  • Payload CMS Runtime                           │  │
│  │  • Workflow Engine                               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Static Assets                            │  │
│  │  • Admin UI Bundle                               │  │
│  │  • React Components                              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                  MONGODB ATLAS                           │
├─────────────────────────────────────────────────────────┤
│  • Managed MongoDB Cluster                              │
│  • Automatic Backups                                    │
│  • High Availability                                    │
└─────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Collection-Agnostic Design
- Workflow engine doesn't hardcode collection names
- Any collection with `workflowStatus` and `currentWorkflowStep` fields is supported
- Workflow definitions reference collections by slug

### 2. Plugin Architecture
- Workflow engine implemented as Payload plugin
- Hooks registered dynamically on all collections
- Clean separation from core Payload functionality

### 3. Immutable Audit Logs
- Workflow logs cannot be updated or deleted
- Complete audit trail for compliance
- Timestamp and user tracking for all actions

### 4. Conditional Step Logic
- Steps can be skipped based on document data
- Supports numeric and string comparisons
- Flexible condition operators (equals, greaterThan, lessThan, notEquals)

### 5. Role-Based and User-Specific Assignments
- Steps can be assigned to roles (e.g., "reviewer", "admin")
- Steps can be assigned to specific users
- User-specific assignments take precedence over role assignments

## Scalability Considerations

1. **Horizontal Scaling**: Vercel serverless functions scale automatically
2. **Database Scaling**: MongoDB Atlas supports vertical and horizontal scaling
3. **Caching**: Workflow definitions can be cached to reduce database queries
4. **Async Processing**: Workflow processing happens asynchronously
5. **Stateless Design**: No server-side session state required

## Technology Stack

- **Backend**: Node.js + Express.js
- **CMS**: Payload CMS v2+
- **Database**: MongoDB (Mongoose ODM)
- **Language**: TypeScript
- **Frontend**: React (Payload Admin UI)
- **Deployment**: Vercel (Serverless)
- **Testing**: Jest + fast-check (Property-Based Testing)

## Excalidraw Diagram Instructions

### Create the following layers from top to bottom:

1. **Client Layer** (Rectangle)
   - Label: "Web Browser / External Systems"
   - Color: Light blue

2. **Presentation Layer** (Rectangle)
   - Label: "Payload Admin UI (React)"
   - Color: Light green
   - Inside: 4 smaller rectangles for components

3. **API Layer** (Rectangle)
   - Label: "Express.js REST API"
   - Color: Light orange
   - Inside: List 3 custom endpoints + Payload APIs

4. **Business Logic Layer** (Large Rectangle)
   - Label: "Workflow Engine Plugin"
   - Color: Light purple
   - Inside: 6 modules (Engine, Actions, Hooks, Logger, Condition Evaluator, Notifications)

5. **Data Layer** (Rectangle)
   - Label: "Payload CMS Collections"
   - Color: Light yellow
   - Inside: 5 collection boxes

6. **Database Layer** (Rectangle)
   - Label: "MongoDB Database"
   - Color: Light gray

### Add Arrows showing data flow:
- Client → Admin UI (HTTP/HTTPS)
- Admin UI → API Layer (REST API Calls)
- API Layer → Business Logic (Function Calls)
- Business Logic → Data Layer (CRUD Operations)
- Data Layer → Database (Mongoose ODM)

### Add side annotations:
- Authentication: JWT tokens
- Authorization: Role-based + User-specific
- Audit: Immutable logs
- Notifications: Console simulation (extensible)

