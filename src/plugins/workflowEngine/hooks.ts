import { CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload/types';
import { processWorkflow } from './engine';

/**
 * Detects if a collection is workflow-enabled
 * Checks for presence of workflowStatus and currentWorkflowStep fields
 */
export function isWorkflowEnabled(collection: any): boolean {
  if (!collection || !collection.fields) {
    return false;
  }
  
  const hasWorkflowStatus = collection.fields.some(
    (field: any) => field.name === 'workflowStatus'
  );
  const hasCurrentStep = collection.fields.some(
    (field: any) => field.name === 'currentWorkflowStep'
  );
  
  return hasWorkflowStatus && hasCurrentStep;
}

/**
 * After change hook for workflow initiation
 * Detects workflow-enabled collections and initiates workflow processing
 */
export const workflowAfterChangeHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  collection,
  operation,
}) => {
  try {
    const payload = req.payload;
    const collectionSlug = collection.slug;
    
    // Only process on create or update operations
    if (operation !== 'create' && operation !== 'update') {
      return doc;
    }
    
    // Check if collection is workflow-enabled
    if (!isWorkflowEnabled(collection)) {
      return doc;
    }
    
    // Find matching workflow definitions
    const workflows = await payload.find({
      collection: 'workflow-definitions',
      where: {
        collectionSlug: { equals: collectionSlug },
      },
    });
    
    // If no workflow exists, allow normal operations
    if (workflows.docs.length === 0) {
      return doc;
    }
    
    // Initiate workflow processing
    await processWorkflow(collectionSlug, doc.id, payload);
  } catch (error) {
    console.error('[Workflow Hook Error]', error);
  }
  
  return doc;
};


/**
 * Before change hook for validation
 * Validates workflow state transitions
 */
export const workflowBeforeChangeHook: CollectionBeforeChangeHook = async ({
  data,
}) => {
  // Allow system to update workflow fields
  // Prevent manual manipulation by users
  // This is a placeholder for future validation logic
  return data;
};
