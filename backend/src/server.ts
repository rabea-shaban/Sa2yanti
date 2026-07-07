import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDb from './config/db';
import { seedSuperAdmin } from './utils/seed';

const startServer = async () => {
  await connectDb();
  await seedSuperAdmin();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
