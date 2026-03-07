import React from 'react';
import { WorkflowStep } from '../types';

interface WorkflowProgressProps {
  completedSteps: WorkflowStep[];
  currentStep: number;
  pendingSteps: WorkflowStep[];
}

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({
  completedSteps,
  currentStep,
  pendingSteps,
}) => {
  const allSteps = [...completedSteps, ...pendingSteps];

  return (
    <div className="workflow-progress" style={{ margin: '20px 0' }}>
      <h4>Workflow Progress</h4>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {allSteps.map((step, index) => {
          const isCompleted = index < completedSteps.length;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step.id || index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCompleted
                    ? '#4caf50'
                    : isCurrent
                    ? '#ff9800'
                    : '#e0e0e0',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                {isCompleted ? '✔' : isCurrent ? '⏳' : '⬜'}
              </div>
              <div style={{ marginTop: '8px', fontSize: '12px', textAlign: 'center' }}>
                {step.stepName}
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>
                {step.stepType}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowProgress;
