import React from 'react';
import { WorkflowLog } from '../types';

interface WorkflowLogViewerProps {
  logs: WorkflowLog[];
}

export const WorkflowLogViewer: React.FC<WorkflowLogViewerProps> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        No workflow logs yet
      </div>
    );
  }

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'approve':
        return '#4caf50';
      case 'reject':
        return '#f44336';
      case 'comment':
        return '#2196f3';
      case 'start':
        return '#9c27b0';
      case 'complete':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  return (
    <div className="workflow-log-viewer" style={{ margin: '20px 0' }}>
      <h4>Workflow History</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {logs.map((log) => (
          <div
            key={log.id}
            style={{
              padding: '15px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              backgroundColor: '#fafafa',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    backgroundColor: getActionBadgeColor(log.action),
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {log.action.toUpperCase()}
                </span>
                <span style={{ fontWeight: 'bold' }}>
                  {typeof log.user === 'object' ? (log.user as any).email : log.user}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
            {log.comment && (
              <div style={{ marginTop: '8px', fontStyle: 'italic', color: '#555' }}>
                "{log.comment}"
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowLogViewer;
