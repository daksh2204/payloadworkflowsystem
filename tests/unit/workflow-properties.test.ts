import fc from 'fast-check';
import { evaluateCondition } from '../../src/utils/conditionEvaluator';
import { isUserAuthorizedForStep } from '../../src/plugins/workflowEngine/engine';

// Feature: payload-workflow-system, Property 17: Condition Operator Support
describe('Property 17: Condition Operator Support', () => {
  test('should correctly evaluate all operators', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.nat({ max: 1000 }),
        fc.nat({ max: 1000 }),
        fc.constantFrom('=', '>', '<', '!='),
        async (fieldValue, conditionValue, operator) => {
          const document = { testField: fieldValue };
          const result = evaluateCondition(document, {
            field: 'testField',
            operator: operator as any,
            value: String(conditionValue),
          });

          expect(typeof result.passed).toBe('boolean');

          // Verify operator semantics
          switch (operator) {
            case '=':
              expect(result.passed).toBe(fieldValue === conditionValue);
              break;
            case '>':
              expect(result.passed).toBe(fieldValue > conditionValue);
              break;
            case '<':
              expect(result.passed).toBe(fieldValue < conditionValue);
              break;
            case '!=':
              expect(result.passed).toBe(fieldValue !== conditionValue);
              break;
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: payload-workflow-system, Property 18: Type-Aware Comparison
describe('Property 18: Type-Aware Comparison', () => {
  test('should perform numeric comparison for numeric values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.nat({ max: 1000 }),
        fc.nat({ max: 1000 }),
        async (num1, num2) => {
          const document = { amount: num1 };
          const result = evaluateCondition(document, {
            field: 'amount',
            operator: '>',
            value: String(num2),
          });

          expect(result.passed).toBe(num1 > num2);
        }
      ),
      { numRuns: 100 }
    );
  });


  test('should perform string comparison for string values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 10 }),
        fc.string({ minLength: 1, maxLength: 10 }),
        async (str1, str2) => {
          const document = { status: str1 };
          const result = evaluateCondition(document, {
            field: 'status',
            operator: '=',
            value: str2,
          });

          expect(result.passed).toBe(str1 === str2);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: payload-workflow-system, Property 19: Missing Field Handling
describe('Property 19: Missing Field Handling', () => {
  test('should return false when field does not exist', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }),
        async (fieldName) => {
          const document = { otherField: 'value' };
          const result = evaluateCondition(document, {
            field: fieldName,
            operator: '=',
            value: 'test',
          });

          expect(result.passed).toBe(false);
          expect(result.error).toContain('not found');
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: payload-workflow-system, Property 20: Boolean Condition Result
describe('Property 20: Boolean Condition Result', () => {
  test('should always return boolean for valid conditions', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.anything(),
        fc.constantFrom('=', '>', '<', '!='),
        fc.string(),
        async (fieldValue, operator, conditionValue) => {
          const document = { testField: fieldValue };
          const result = evaluateCondition(document, {
            field: 'testField',
            operator: operator as any,
            value: conditionValue,
          });

          expect(typeof result.passed).toBe('boolean');
        }
      ),
      { numRuns: 100 }
    );
  });
});


// Feature: payload-workflow-system, Property 5: Assignment Precedence
describe('Property 5: Assignment Precedence', () => {
  test('should prioritize assignedUser over assignedRole', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        fc.uuid(),
        fc.constantFrom('admin', 'reviewer', 'editor'),
        async (userId1, userId2, role) => {
          const user = { id: userId1, email: 'test@test.com', role };
          const step = {
            id: 'step1',
            stepName: 'Test',
            stepType: 'approval' as const,
            order: 1,
            assignedUser: userId2,
            assignedRole: role,
          };

          const isAuthorized = isUserAuthorizedForStep(user, step);

          // Should only be authorized if user.id matches assignedUser
          expect(isAuthorized).toBe(userId1 === userId2);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: payload-workflow-system, Property 6: Unassigned Step Authorization
describe('Property 6: Unassigned Step Authorization', () => {
  test('should allow any authenticated user for unassigned steps', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        fc.string({ minLength: 1 }),
        fc.constantFrom('admin', 'reviewer', 'editor'),
        async (userId, email, role) => {
          const user = { id: userId, email, role };
          const step = {
            id: 'step1',
            stepName: 'Test',
            stepType: 'approval' as const,
            order: 1,
            // No assignedUser or assignedRole
          };

          const isAuthorized = isUserAuthorizedForStep(user, step);

          expect(isAuthorized).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: payload-workflow-system, Property 39: Type Coercion Handling
describe('Property 39: Type Coercion Handling', () => {
  test('should handle type coercion correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.nat({ max: 1000 }),
        async (numValue) => {
          const document = { amount: numValue };
          const result = evaluateCondition(document, {
            field: 'amount',
            operator: '=',
            value: String(numValue),
          });

          expect(result.passed).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
