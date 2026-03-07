import { ConditionConfig, ConditionResult } from '../types';

/**
 * Evaluates a condition against a document's field value
 * Supports operators: equals, greaterThan, lessThan, notEquals (also supports legacy: =, >, <, !=)
 * Handles both numeric and string comparisons
 * Returns false if field is missing
 */
export function evaluateCondition(
  document: any,
  condition: ConditionConfig
): ConditionResult {
  // Extract field value from document
  const fieldValue = document[condition.field];
  
  // Return false if field is missing
  if (fieldValue === undefined || fieldValue === null) {
    return { 
      passed: false, 
      error: `Field ${condition.field} not found` 
    };
  }

  // Determine if values are numeric
  const isNumeric = !isNaN(Number(fieldValue)) && !isNaN(Number(condition.value));
  
  let passed = false;
  
  if (isNumeric) {
    // Perform numeric comparison
    const numField = Number(fieldValue);
    const numValue = Number(condition.value);
    
    switch (condition.operator) {
      case '=':
      case 'equals':
        passed = numField === numValue;
        break;
      case '>':
      case 'greaterThan':
        passed = numField > numValue;
        break;
      case '<':
      case 'lessThan':
        passed = numField < numValue;
        break;
      case '!=':
      case 'notEquals':
        passed = numField !== numValue;
        break;
    }
  } else {
    // Perform string comparison
    const strField = String(fieldValue);
    const strValue = String(condition.value);
    
    switch (condition.operator) {
      case '=':
      case 'equals':
        passed = strField === strValue;
        break;
      case '>':
      case 'greaterThan':
        passed = strField > strValue;
        break;
      case '<':
      case 'lessThan':
        passed = strField < strValue;
        break;
      case '!=':
      case 'notEquals':
        passed = strField !== strValue;
        break;
    }
  }

  return { passed };
}
