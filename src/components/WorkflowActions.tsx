import React, { useState } from 'react';
import { User, WorkflowStep } from '../types';

interface WorkflowActionsProps {
  currentStep: number;
  currentUser: User;
  currentStepData?: WorkflowStep;
  onAction: (action: string, comment?: string) => Promise<void>;
  isAuthorized: boolean;
}

export const WorkflowActions: React.FC<WorkflowActionsProps> = ({
  onAction,
  isAuthorized,
}) => {
  const [comment, setComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

  if (!isAuthorized) {
    return (
      <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        You are not authorized to perform actions on this workflow step.
      </div>
    );
  }

  const handleApprove = async () => {
    await onAction('approve', comment || undefined);
    setComment('');
  };

  const handleReject = async () => {
    await onAction('reject', comment || undefined);
    setComment('');
  };

  const handleComment = async () => {
    if (comment.trim()) {
      await onAction('comment', comment);
      setComment('');
      setShowCommentInput(false);
    }
  };

  return (
    <div className="workflow-actions" style={{ margin: '20px 0' }}>
      <h4>Actions</h4>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button
          onClick={handleApprove}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Approve
        </button>
        <button
          onClick={handleReject}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reject
        </button>
        <button
          onClick={() => setShowCommentInput(!showCommentInput)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Comment
        </button>
      </div>

      {showCommentInput && (
        <div style={{ marginTop: '10px' }}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
            placeholder="Enter your comment..."
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <button
            onClick={handleComment}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Submit Comment
          </button>
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={comment.length > 0}
            readOnly
            style={{ marginRight: '5px' }}
          />
          Add comment to action
        </label>
        {comment.length === 0 && (
          <textarea
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
            placeholder="Optional comment..."
            style={{
              width: '100%',
              marginTop: '10px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default WorkflowActions;
