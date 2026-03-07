import { Payload } from 'payload';
import { WorkflowLog } from '../../types';

/**
 * Creates an immutable workflow log entry
 */
export async function createWorkflowLog(
  payload: Payload,
  logData: Omit<WorkflowLog, 'id'>
): Promise<void> {
  await payload.create({
    collection: 'workflow-logs',
    data: {
      ...logData,
      timestamp: new Date(),
    },
  });
}

/**
 * Retrieves workflow logs for a specific document
 * Returns logs in reverse chronological order
 */
export async function getWorkflowLogs(
  payload: Payload,
  collectionSlug: string,
  documentId: string
): Promise<any[]> {
  const logs = await payload.find({
    collection: 'workflow-logs',
    where: {
      and: [
        { collectionSlug: { equals: collectionSlug } },
        { documentId: { equals: documentId } },
      ],
    },
    sort: '-timestamp',
  });

  return logs.docs;
}
