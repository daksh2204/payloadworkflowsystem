import { CollectionConfig } from 'payload/types';

const WorkflowLogs: CollectionConfig = {
  slug: 'workflow-logs',
  admin: {
    useAsTitle: 'action',
    group: 'Workflow System',
    defaultColumns: ['timestamp', 'action', 'user', 'collectionSlug'],
  },
  access: {
    read: () => true,
    create: () => true, // Only created by system
    update: () => false, // Immutable
    delete: () => false, // Immutable
  },
  fields: [
    {
      name: 'workflowId',
      type: 'text',
      required: true,
    },
    {
      name: 'collectionSlug',
      type: 'text',
      required: true,
    },
    {
      name: 'documentId',
      type: 'text',
      required: true,
    },
    {
      name: 'stepId',
      type: 'text',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'action',
      type: 'text',
      required: true,
    },
    {
      name: 'comment',
      type: 'textarea',
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      admin: {
        date: {
          displayFormat: 'yyyy-MM-dd HH:mm:ss',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ operation }) => {
        if (operation === 'update') {
          throw new Error('Workflow logs are immutable and cannot be updated');
        }
      },
    ],
  },
};

export default WorkflowLogs;
