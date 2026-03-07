import { Payload } from 'payload';
import { WorkflowStep, User } from '../../types';
import { evaluateCondition } from '../../utils/conditionEvaluator';
import { sendNotification } from './notifications';

/**
 * Processes workflow for a document
 * Finds next eligible step based on conditions and updates document state
 */
export async function processWorkflow(
  collectionSlug: string,
  documentId: string,
  payload: Payload
): Promise<void> {
  try {
    // 1. Retrieve document
    const document = await payload.findByID({
      collection: collectionSlug,
      id: documentId,
    });

    // 2. Find workflow definition for collection
    const workflows = await payload.find({
      collection: 'workflow-definitions',
      where: {
        collectionSlug: { equals: collectionSlug },
      },
    });

    if (workflows.docs.length === 0) {
      return; // No workflow configured
    }

    const workflow = workflows.docs[0] as any;
    const currentStepIndex = document.currentWorkflowStep as number;

    // 3. Get steps in order
    const sortedSteps = workflow.steps.sort((a: any, b: any) => a.order - b.order);

    // 4. Find next eligible step
    const nextStep = await findNextEligibleStep(
      document,
      sortedSteps,
      currentStepIndex
    );

    // 5. Update document state
    if (nextStep) {
      await updateDocumentWorkflowState(
        payload,
        collectionSlug,
        documentId,
        'in-progress',
        sortedSteps.indexOf(nextStep)
      );

      // 6. Send notification
      await sendNotification(workflow, nextStep, document, payload);
    } else {
      // All steps completed
      await updateDocumentWorkflowState(
        payload,
        collectionSlug,
        documentId,
        'completed',
        currentStepIndex
      );
    }
  } catch (error) {
    console.error('[Workflow Engine Error]', error);
    throw error;
  }
}

/**
 * Finds the next eligible step based on conditions
 * Iterates through steps in order and evaluates conditions
 */
export async function findNextEligibleStep(
  document: any,
  sortedSteps: any[],
  currentStepIndex: number
): Promise<any | null> {
  for (let i = currentStepIndex; i < sortedSteps.length; i++) {
    const step = sortedSteps[i];
    
    // Evaluate condition if present
    if (step.conditionField) {
      const conditionResult = evaluateCondition(document, {
        field: step.conditionField,
        operator: step.conditionOperator,
        value: step.conditionValue,
      });
      
      if (!conditionResult.passed) {
        continue; // Skip this step
      }
    }
    
    return step;
  }
  
  return null; // No more eligible steps
}

/**
 * Updates document workflow status and current step
 */
export async function updateDocumentWorkflowState(
  payload: Payload,
  collectionSlug: string,
  documentId: string,
  workflowStatus: string,
  currentWorkflowStep: number
): Promise<void> {
  await payload.update({
    collection: collectionSlug,
    id: documentId,
    data: {
      workflowStatus,
      currentWorkflowStep,
    },
  });
}


/**
 * Checks if a user is authorized to perform a workflow step
 * Priority: assignedUser > assignedRole > allow all
 */
export function isUserAuthorizedForStep(
  user: User,
  step: WorkflowStep
): boolean {
  // 1. If specific user assigned, check exact match
  if (step.assignedUser) {
    return user.id === step.assignedUser;
  }

  // 2. If role assigned, check user has role
  if (step.assignedRole) {
    return user.role === step.assignedRole;
  }

  // 3. No restrictions - any authenticated user
  return true;
}
