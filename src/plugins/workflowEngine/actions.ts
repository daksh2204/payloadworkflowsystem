import { Payload } from 'payload';
import { WorkflowActionRequest, User } from '../../types';
import { isUserAuthorizedForStep } from './engine';
import { createWorkflowLog } from './logger';
import { processWorkflow } from './engine';

/**
 * Executes a workflow action (approve, reject, comment)
 * Validates authorization, creates log entry, and updates document state
 */
export async function executeWorkflowAction(
  action: WorkflowActionRequest,
  user: User,
  payload: Payload
): Promise<void> {
  // 1. Retrieve document and workflow
  const document = await payload.findByID({
    collection: action.collection,
    id: action.documentId,
  });

  const workflows = await payload.find({
    collection: 'workflow-definitions',
    where: {
      collectionSlug: { equals: action.collection },
    },
  });

  if (workflows.docs.length === 0) {
    throw new Error('No workflow configured for this collection');
  }

  const workflow = workflows.docs[0] as any;
  const sortedSteps = workflow.steps.sort((a: any, b: any) => a.order - b.order);
  const currentStep = sortedSteps[document.currentWorkflowStep as number];

  if (!currentStep) {
    throw new Error('No current workflow step found');
  }

  // 2. Validate authorization
  const isAuthorized = isUserAuthorizedForStep(user, currentStep);
  if (!isAuthorized) {
    throw new Error('User not authorized for this workflow step');
  }

  // 3. Create log entry
  await createWorkflowLog(payload, {
    workflowId: workflow.id,
    collectionSlug: action.collection,
    documentId: action.documentId,
    stepId: currentStep.id || String(currentStep.order),
    user: user.id,
    action: action.action,
    comment: action.comment,
    timestamp: new Date(),
  });


  // 4. Update document state based on action
  if (action.action === 'approve') {
    // Advance to next step
    await processWorkflow(action.collection, action.documentId, payload);
  } else if (action.action === 'reject') {
    // Mark as rejected
    await payload.update({
      collection: action.collection,
      id: action.documentId,
      data: {
        workflowStatus: 'rejected',
      },
    });
  }
  // 'comment' action only creates log entry, no state change
}
