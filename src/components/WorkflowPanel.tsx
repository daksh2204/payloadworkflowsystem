import React, { useState, useEffect } from 'react';
import { WorkflowStatusResponse, User } from '../types';
import WorkflowProgress from './WorkflowProgress';
import WorkflowActions from './WorkflowActions';
import WorkflowLogViewer from './WorkflowLogViewer';

interface WorkflowPanelProps {
  documentId: string;
  collection: string;
  currentUser: User;
}

export const WorkflowPanel: React.FC<WorkflowPanelProps> = ({
  documentId,
  collection,
  currentUser,
}) => {
  const [workflowState, setWorkflowState] = useState<WorkflowStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflowStatus();
  }, [documentId, collection]);

  const fetchWorkflowStatus = async () => {
    try {
      const response = await fetch(
        `/api/workflows/status/${documentId}?collection=${collection}`
      );
      const data = (await response.json()) as WorkflowStatusResponse;
      setWorkflowState(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workflow status:', error);
      setLoading(false);
    }
  };

  const handleAction = async (action: string, comment?: string) => {
    try {
      await fetch('/api/workflows/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          collection,
          action,
          comment,
        }),
      });
      await fetchWorkflowStatus(); // Refresh state
    } catch (error) {
      console.error('Error executing workflow action:', error);
    }
  };

  if (loading) return <div>Loading workflow...</div>;
  if (!workflowState?.workflowName) return <div>No workflow configured</div>;

  const allSteps = [...workflowState.completedSteps, ...workflowState.pendingSteps];
  const currentStepData = allSteps[workflowState.currentStep];
  
  // Check if user is authorized for current step
  const isAuthorized = currentStepData
    ? (currentStepData.assignedUser === currentUser.id ||
       currentStepData.assignedRole === currentUser.role ||
       (!currentStepData.assignedUser && !currentStepData.assignedRole))
    : false;

  return (
    <div className="workflow-panel" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>{workflowState.workflowName}</h3>
      
      <WorkflowProgress
        completedSteps={workflowState.completedSteps}
        currentStep={workflowState.currentStep}
        pendingSteps={workflowState.pendingSteps}
      />
      
      <WorkflowActions
        currentStep={workflowState.currentStep}
        currentUser={currentUser}
        currentStepData={currentStepData}
        onAction={handleAction}
        isAuthorized={isAuthorized}
      />
      
      <WorkflowLogViewer logs={workflowState.logs} />
    </div>
  );
};

export default WorkflowPanel;
