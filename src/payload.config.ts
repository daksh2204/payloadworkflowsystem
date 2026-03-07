import { buildConfig } from 'payload/config';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import path from 'path';
import { webpackBundler } from '@payloadcms/bundler-webpack';

// Import collections
import Blogs from './collections/Blogs';
import Contracts from './collections/Contracts';
import WorkflowDefinitions from './collections/WorkflowDefinitions';
import WorkflowLogs from './collections/WorkflowLogs';

// Import workflow plugin
import { workflowPlugin } from './plugins/workflowEngine';

export default buildConfig({
  serverURL: process.env.SERVER_URL || 'http://localhost:3000',
  admin: {
    user: 'users',
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- Workflow System',
    },
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      fields: [
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'editor',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Reviewer', value: 'reviewer' },
            { label: 'Editor', value: 'editor' },
          ],
        },
      ],
    },
    Blogs,
    Contracts,
    WorkflowDefinitions,
    WorkflowLogs,
  ],
  editor: slateEditor({}),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/payload-workflow',
  }),
  plugins: [
    workflowPlugin({
      enabled: true,
    }),
  ],
});
