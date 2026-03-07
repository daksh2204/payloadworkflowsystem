// Plugin Configuration
export interface WorkflowPluginConfig {
  enabled: boolean;
  collections?: string[]; // Optional: restrict to specific collections
  notificationHandler?: (notification: NotificationPayload) => void;
}

export interface NotificationPayload {
  recipientEmail: string;
  workflowName: string;
  stepName: string;
  documentId: string;
  collectionSlug: string;
}
