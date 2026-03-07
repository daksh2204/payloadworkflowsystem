// Workflow Definition Structure
export interface WorkflowDefinition {
  id: string;
  name: string;
  collectionSlug: string;
  steps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  stepName: string;
  stepType: 'approval' | 'review' | 'sign-off' | 'comment';
  order: number;
  assignedRole?: string;
  assignedUser?: string; // User ID
  conditionField?: string;
  conditionOperator?: '=' | '>' | '<' | '!=';
  conditionValue?: string;
}

// Workflow Log Structure
export interface WorkflowLog {
  id: string;
  workflowId: string;
  collectionSlug: string;
  documentId: string;
  stepId: string;
  user: string; // User ID
  action: 'approve' | 'reject' | 'comment' | 'start' | 'complete';
  comment?: string;
  timestamp: Date;
}

// Document Workflow Fields (mixin for collections)
export interface WorkflowFields {
  workflowStatus: 'pending' | 'in-progress' | 'completed' | 'rejected';
  currentWorkflowStep: number;
}

// API Request/Response Types
export interface TriggerWorkflowRequest {
  collection: string;
  documentId: string;
}

export interface TriggerWorkflowResponse {
  success: boolean;
  workflowStatus: string;
  currentStep: number;
  message?: string;
}

export interface WorkflowStatusResponse {
  workflowName: string | null;
  currentStep: number;
  completedSteps: WorkflowStep[];
  pendingSteps: WorkflowStep[];
  logs: WorkflowLog[];
}

export interface WorkflowActionRequest {
  documentId: string;
  collection: string;
  action: 'approve' | 'reject' | 'comment';
  comment?: string;
}

// User Interface
export interface User {
  id: string;
  email: string;
  role: string;
}
