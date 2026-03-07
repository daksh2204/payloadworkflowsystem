import { Request, Response } from 'express';
import { Payload } from 'payload';
import { getWorkflowLogs } from '../logger';

/**
 * GET /api/workflows/status/:docId
 * Retrieves workflow status and logs for a document
 */
export const statusWorkflowEndpoint = (payload: Payload) => {
  return async (req: Request, res: Response) => {
    try {
      const { docId } = req.params;
      const { collection } = req.query;

      if (!collection || typeof collection !== 'string') {
        return res.status(400).json({
          error: 'Collection query parameter is required',
        });
      }

      // Find workflow definition
      const workflows = await payload.find({
        collection: 'workflow-definitions',
        where: {
          collectionSlug: { equals: collection },
        },
      });

      if (workflows.docs.length === 0) {
        return res.json({
          workflowName: null,
          currentStep: 0,
          completedSteps: [],
          pendingSteps: [],
          logs: [],
        });
      }

      const workflow = workflows.docs[0] as any;

      // Retrieve document
      try {
        const document = await payload.findByID({
          collection,
          id: docId,
        });

        const sortedSteps = workflow.steps.sort((a: any, b: any) => a.order - b.order);
        const completedSteps = sortedSteps.slice(0, document.currentWorkflowStep);
        const pendingSteps = sortedSteps.slice(document.currentWorkflowStep);

        // Retrieve logs
        const logs = await getWorkflowLogs(payload, collection, docId);

        res.json({
          workflowName: workflow.name,
          currentStep: document.currentWorkflowStep,
          completedSteps,
          pendingSteps,
          logs,
        });
        return;
      } catch (error) {
        return res.status(404).json({
          error: 'Document not found',
        });
      }
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
      return;
    }
  };
};
