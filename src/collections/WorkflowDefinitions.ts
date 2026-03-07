import { CollectionConfig } from 'payload/types';

const WorkflowDefinitions: CollectionConfig = {
  slug: 'workflow-definitions',
  admin: {
    useAsTitle: 'name',
    group: 'Workflow System',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'collectionSlug',
      type: 'text',
      required: true,
      admin: {
        description: 'The slug of the collection this workflow applies to',
      },
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'stepName',
          type: 'text',
          required: true,
        },
        {
          name: 'stepType',
          type: 'select',
          required: true,
          options: [
            { label: 'Approval', value: 'approval' },
            { label: 'Review', value: 'review' },
            { label: 'Sign-off', value: 'sign-off' },
            { label: 'Comment', value: 'comment' },
          ],
        },
        {
          name: 'order',
          type: 'number',
          required: true,
        },
        {
          name: 'assignedRole',
          type: 'text',
        },
        {
          name: 'assignedUser',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'conditionField',
          type: 'text',
          admin: {
            description: 'Field name to evaluate (e.g., "amount")',
          },
        },
        {
          name: 'conditionOperator',
          type: 'select',
          options: [
            { label: 'Equals', value: 'equals' },
            { label: 'Greater Than', value: 'greaterThan' },
            { label: 'Less Than', value: 'lessThan' },
            { label: 'Not Equals', value: 'notEquals' },
          ],
        },
        {
          name: 'conditionValue',
          type: 'text',
          admin: {
            description: 'Value to compare against',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Validate that collectionSlug references an existing collection
        if (operation === 'create' || operation === 'update') {
          const payload = req.payload;
          if (data.collectionSlug && !payload.collections[data.collectionSlug]) {
            throw new Error(`Collection "${data.collectionSlug}" does not exist`);
          }
        }
        return data;
      },
    ],
  },
};

export default WorkflowDefinitions;
