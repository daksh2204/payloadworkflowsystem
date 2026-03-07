import { Request, Response } from 'express';
import { Payload } from 'payload';
import { executeWorkflowAction } from '../actions';

/**
 * POST /api/workflows/action
 * Executes a workflow action (approve, reject, comment)
 */
export const actionWorkflowEndpoint = (payload: Payload) => {
  return async (req: Request, res: Response) => {
    try {
      const { documentId, collection, action, comment } = req.body;
      const user = (req as any).user; // From authentication middleware

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      await executeWorkflowAction(
        { documentId, collection, action, comment },
        user,
        payload
      );

      // Retrieve updated document
      const updatedDoc = await payload.findByID({
        collection,
        id: documentId,
      });

      res.json({
        success: true,
        workflowStatus: updatedDoc.workflowStatus,
        currentStep: updatedDoc.currentWorkflowStep,
        message: 'Action processed successfully',
      });
      return;
    } catch (error: any) {
      if (error.message.includes('not authorized')) {
        res.status(403).json({
          success: false,
          error: error.message,
        });
        return;
      } else {
        res.status(500).json({
          success: false,
          error: error.message,
        });
        return;
      }
    }
  };
};
