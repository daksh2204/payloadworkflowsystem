import payload from 'payload';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',
    local: true,
  });

  console.log('Seeding database...');

  // Create demo users
  try {
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@demo.com',
        password: 'admin123',
        role: 'admin',
      },
    });
    console.log('Created admin user:', adminUser.email);
  } catch (error) {
    console.log('Admin user already exists');
  }

  try {
    const reviewerUser = await payload.create({
      collection: 'users',
      data: {
        email: 'reviewer@demo.com',
        password: 'reviewer123',
        role: 'reviewer',
      },
    });
    console.log('Created reviewer user:', reviewerUser.email);
  } catch (error) {
    console.log('Reviewer user already exists');
  }

  try {
    const editorUser = await payload.create({
      collection: 'users',
      data: {
        email: 'editor@demo.com',
        password: 'editor123',
        role: 'editor',
      },
    });
    console.log('Created editor user:', editorUser.email);
  } catch (error) {
    console.log('Editor user already exists');
  }

  // Create sample workflow
  try {
    const workflow = await payload.create({
      collection: 'workflow-definitions',
      data: {
        name: 'Blog Approval Workflow',
        collectionSlug: 'blogs',
        steps: [
          {
            stepName: 'Review',
            stepType: 'review',
            order: 1,
            assignedRole: 'reviewer',
          },
          {
            stepName: 'Approval',
            stepType: 'approval',
            order: 2,
            assignedRole: 'admin',
          },
        ],
      },
    });
    console.log('Created workflow:', workflow.name);
  } catch (error) {
    console.log('Workflow already exists');
  }

  console.log('Seeding complete!');
  process.exit(0);
};

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
