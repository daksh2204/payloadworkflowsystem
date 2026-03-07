import { Request, Response } from 'express';
import { Payload } from 'payload';
import { processWorkflow } from '../engine';

/**
 * POST /api/workflows/trigger
 * Manually triggers workflow processing for a document
 */
export const triggerWorkflowEndpoint = (payload: Payload) => {
  return async (req: Request, res: Response) => {
    try {
      const { collection, documentId } = req.body;

      // Validate collection exists
      if (!payload.collections[collection]) {
        return res.status(400).json({
          success: false,
          error: 'Invalid collection slug',
        });
      }

      // Validate document exists
      try {
        const document = await payload.findByID({
          collection,
          id: documentId,
        });

        if (!document) {
          return res.status(404).json({
            success: false,
            error: 'Document not found',
          });
        }
      } catch (error) {
        return res.status(404).json({
          success: false,
          error: 'Document not found',
        });
      }

      // Process workflow
      await processWorkflow(collection, documentId, payload);

      // Retrieve updated document
      const updatedDoc = await payload.findByID({
        collection,
        id: documentId,
      });

      res.json({
        success: true,
        workflowStatus: updatedDoc.workflowStatus,
        currentStep: updatedDoc.currentWorkflowStep,
        message: 'Workflow processing initiated',
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
      return;
    }
  };
};
