import { CollectionConfig } from 'payload/types';

const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    // Workflow fields
    {
      name: 'workflowStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'currentWorkflowStep',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
};

export default Blogs;
