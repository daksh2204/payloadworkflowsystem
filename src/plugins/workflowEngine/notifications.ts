import { Payload } from 'payload';

/**
 * Simulates sending an email notification
 * Logs notification details to console with [EMAIL SIMULATION] prefix
 */
export async function sendNotification(
  workflow: any,
  step: any,
  document: any,
  payload: Payload
): Promise<void> {
  let recipientEmail = '';
  
  // Determine recipient email
  if (step.assignedUser) {
    // Fetch user email from assigned user
    try {
      const user: any = await payload.findByID({
        collection: 'users',
        id: step.assignedUser,
      });
      recipientEmail = user.email as string;
    } catch (error) {
      recipientEmail = 'unknown@example.com';
    }
  } else if (step.assignedRole) {
    // Use role as placeholder email
    recipientEmail = `${step.assignedRole}@example.com`;
  } else {
    recipientEmail = 'all-users@example.com';
  }
  
  // Log email simulation
  console.log(`[EMAIL SIMULATION] To: ${recipientEmail}`);
  console.log(`[EMAIL SIMULATION] Subject: Workflow Action Required`);
  console.log(`[EMAIL SIMULATION] Workflow: ${workflow.name}`);
  console.log(`[EMAIL SIMULATION] Step: ${step.stepName}`);
  console.log(`[EMAIL SIMULATION] Document: ${document.id}`);
  console.log(`[EMAIL SIMULATION] Collection: ${workflow.collectionSlug}`);
}
