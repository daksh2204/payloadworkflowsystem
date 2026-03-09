# Excalidraw HLD Creation Instructions

## Step-by-Step Guide to Create High-Level Design Diagram

### Setup
1. Go to https://excalidraw.com/
2. Start with a blank canvas
3. Use the rectangle tool for boxes
4. Use the arrow tool for connections
5. Use the text tool for labels

---

## Diagram Layout (Top to Bottom)

### Layer 1: Client Layer (Top)
**Create a rectangle:**
- Width: 800px
- Height: 80px
- Fill: Light blue (#E3F2FD)
- Border: Dark blue
- Text inside: "CLIENT LAYER"
- Below text: "Web Browsers | External API Clients | Mobile Apps"

---

### Layer 2: Presentation Layer
**Create a rectangle:**
- Width: 800px
- Height: 150px
- Fill: Light green (#E8F5E9)
- Border: Dark green
- Text inside: "PRESENTATION LAYER - Payload Admin UI (React)"

**Inside this rectangle, create 4 smaller boxes:**

1. **WorkflowPanel**
   - Size: 150x60px
   - Text: "WorkflowPanel\nComponent"

2. **WorkflowProgress**
   - Size: 150x60px
   - Text: "WorkflowProgress\nComponent"

3. **WorkflowActions**
   - Size: 150x60px
   - Text: "WorkflowActions\nComponent"

4. **WorkflowLogViewer**
   - Size: 150x60px
   - Text: "WorkflowLogViewer\nComponent"

---

### Layer 3: API Layer
**Create a rectangle:**
- Width: 800px
- Height: 120px
- Fill: Light orange (#FFF3E0)
- Border: Dark orange
- Text inside: "API LAYER - Express.js REST API"

**Inside, add text list:**
```
Custom Endpoints:
• POST /api/workflows/trigger
• GET /api/workflows/status/:docId
• POST /api/workflows/action

Payload APIs:
• /api/blogs | /api/contracts
• /api/workflow-definitions | /api/workflow-logs
```

---

### Layer 4: Business Logic Layer (Largest)
**Create a large rectangle:**
- Width: 800px
- Height: 250px
- Fill: Light purple (#F3E5F5)
- Border: Dark purple
- Text inside: "BUSINESS LOGIC LAYER - Workflow Engine Plugin"

**Inside, create 6 module boxes in 2 rows:**

**Row 1:**
1. **Core Engine**
   - Size: 240x80px
   - Text: "Core Engine\n• processWorkflow()\n• findNextEligibleStep()\n• updateDocumentState()"

2. **Actions Module**
   - Size: 240x80px
   - Text: "Actions Module\n• executeWorkflowAction()\n• approve()\n• reject()"

3. **Hooks Module**
   - Size: 240x80px
   - Text: "Hooks Module\n• afterChange\n• beforeChange\n• triggerWorkflow()"

**Row 2:**
4. **Logger Module**
   - Size: 240x80px
   - Text: "Logger Module\n• createWorkflowLog()\n• getWorkflowLogs()"

5. **Condition Evaluator**
   - Size: 240x80px
   - Text: "Condition Evaluator\n• evaluateCondition()\n• operators: =,>,<,!="

6. **Notifications**
   - Size: 240x80px
   - Text: "Notifications\n• sendNotification()\n• Email simulation"

---

### Layer 5: Data Layer
**Create a rectangle:**
- Width: 800px
- Height: 120px
- Fill: Light yellow (#FFFDE7)
- Border: Dark yellow
- Text inside: "DATA LAYER - Payload CMS Collections"

**Inside, create 5 boxes:**

1. **WorkflowDefinitions**
   - Size: 140x60px
   - Text: "Workflow\nDefinitions"

2. **WorkflowLogs**
   - Size: 140x60px
   - Text: "Workflow\nLogs"

3. **Users**
   - Size: 140x60px
   - Text: "Users\nCollection"

4. **Blogs**
   - Size: 140x60px
   - Text: "Blogs\nCollection"

5. **Contracts**
   - Size: 140x60px
   - Text: "Contracts\nCollection"

---

### Layer 6: Database Layer (Bottom)
**Create a rectangle:**
- Width: 800px
- Height: 80px
- Fill: Light gray (#F5F5F5)
- Border: Dark gray
- Text inside: "DATABASE LAYER"
- Below text: "MongoDB Atlas | Mongoose ODM | Cloud Database"

---

## Add Arrows (Data Flow)

### Vertical Arrows (Main Flow):
1. Client Layer → Presentation Layer
   - Label: "HTTPS Requests"

2. Presentation Layer → API Layer
   - Label: "REST API Calls"

3. API Layer → Business Logic Layer
   - Label: "Function Invocations"

4. Business Logic Layer → Data Layer
   - Label: "CRUD Operations"

5. Data Layer → Database Layer
   - Label: "Mongoose ODM"

### Horizontal Arrows (Within Business Logic):
- Core Engine ↔ Actions Module
- Core Engine ↔ Logger Module
- Core Engine ↔ Condition Evaluator
- Actions Module → Notifications
- Hooks Module → Core Engine

---

## Add Side Annotations

### Left Side (Security):
**Create a text box:**
```
SECURITY
─────────
• Authentication: JWT
• Authorization: RBAC
• User-Specific Access
• Role-Based Permissions
```

### Right Side (Features):
**Create a text box:**
```
KEY FEATURES
────────────
• Multi-Step Workflows
• Conditional Logic
• Immutable Audit Logs
• Real-time Status
• Email Notifications
```

### Bottom (Technology):
**Create a text box:**
```
TECH STACK: Node.js | TypeScript | Express.js | Payload CMS v2+ | MongoDB | React | Vercel
```

---

## Add a Separate Flow Diagram

### Workflow Execution Flow (Below main diagram)

**Create a horizontal flow:**

```
[Document Created] → [Hook Triggered] → [Find Workflow] → [Evaluate Conditions] → 
[Assign Step] → [Create Log] → [Send Notification] → [Update Status] → [Complete]
```

**Use:**
- Rounded rectangles for each step
- Arrows connecting them left to right
- Different color for each step (gradient from blue to green)

---

## Color Scheme

- **Client Layer**: Light Blue (#E3F2FD)
- **Presentation Layer**: Light Green (#E8F5E9)
- **API Layer**: Light Orange (#FFF3E0)
- **Business Logic Layer**: Light Purple (#F3E5F5)
- **Data Layer**: Light Yellow (#FFFDE7)
- **Database Layer**: Light Gray (#F5F5F5)

---

## Final Touches

1. **Add Title** at the very top:
   - Text: "Dynamic Workflow Management System - High-Level Design"
   - Font size: Large
   - Bold

2. **Add Legend** in top-right corner:
   ```
   LEGEND
   ──────
   □ Component
   → Data Flow
   ↔ Bidirectional
   ```

3. **Add Your Name** at bottom:
   - Text: "Designed by: [Your Name]"
   - Text: "Date: March 2026"

4. **Add Version**:
   - Text: "Version: 1.0"

---

## Export Instructions

1. Click "File" → "Export image"
2. Select "PNG" format
3. Check "Embed scene" (allows editing later)
4. Download as `HLD_Workflow_System.png`

**Alternative: Share Link**
1. Click "File" → "Share"
2. Click "Get shareable link"
3. Copy the link
4. This allows evaluators to view and interact with the diagram

---

## Tips for a Professional Diagram

1. **Alignment**: Use Excalidraw's alignment tools to keep boxes aligned
2. **Spacing**: Keep consistent spacing between layers (50-80px)
3. **Font Size**: Use larger fonts for layer titles, smaller for details
4. **Colors**: Use the suggested color scheme for visual hierarchy
5. **Arrows**: Make sure arrows clearly show direction of data flow
6. **Labels**: Label all arrows with what data/action they represent
7. **Grouping**: Group related components together
8. **White Space**: Don't overcrowd - leave breathing room

---

## Example Text for Each Layer

### Client Layer
```
CLIENT LAYER
────────────
Web Browsers | External API Clients | Mobile Apps
Users: Admin, Reviewer, Editor
```

### Presentation Layer
```
PRESENTATION LAYER
──────────────────
Payload Admin UI (React)
Custom Workflow Components
Real-time Status Updates
```

### API Layer
```
API LAYER
─────────
Express.js REST API Server
Custom Workflow Endpoints + Payload Built-in APIs
JWT Authentication Required
```

### Business Logic Layer
```
BUSINESS LOGIC LAYER
────────────────────
Workflow Engine Plugin (TypeScript)
6 Core Modules: Engine, Actions, Hooks, Logger, Evaluator, Notifications
Collection-Agnostic Design
```

### Data Layer
```
DATA LAYER
──────────
Payload CMS Collections
5 Collections: WorkflowDefinitions, WorkflowLogs, Users, Blogs, Contracts
Schema Validation & Access Control
```

### Database Layer
```
DATABASE LAYER
──────────────
MongoDB Atlas (Cloud Database)
Mongoose ODM | Automatic Backups | High Availability
```

---

## Time Estimate

Creating this diagram should take approximately 30-45 minutes if you follow this guide step by step.

