// Condition Evaluation
export interface ConditionConfig {
  field: string;
  operator: '=' | '>' | '<' | '!=' | 'equals' | 'greaterThan' | 'lessThan' | 'notEquals';
  value: string;
}

export interface ConditionResult {
  passed: boolean;
  error?: string;
}
