import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDb from './config/db';
import { seedSuperAdmin } from './utils/seed';

// Run connection and seeding asynchronously
connectDb().then(async () => {
  await seedSuperAdmin();
}).catch(err => {
  console.error('❌ Database connection / seeding failed:', err);
});

// For local development
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
