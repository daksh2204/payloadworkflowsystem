import express from 'express';
import payload from 'payload';
import dotenv from 'dotenv';
import { triggerWorkflowEndpoint } from './plugins/workflowEngine/endpoints/trigger';
import { statusWorkflowEndpoint } from './plugins/workflowEngine/endpoints/status';
import { actionWorkflowEndpoint } from './plugins/workflowEngine/endpoints/action';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Add body parser middleware
app.use(express.json());

// Initialize Payload
const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',
    express: app,
    onInit: async () => {
      console.log('Payload CMS initialized');
      console.log(`Admin URL: http://localhost:${PORT}/admin`);
    },
  });

  // Register custom workflow API endpoints
  app.post('/api/workflows/trigger', triggerWorkflowEndpoint(payload));
  app.get('/api/workflows/status/:docId', statusWorkflowEndpoint(payload));
  app.post('/api/workflows/action', actionWorkflowEndpoint(payload));

  // Start Express server
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
