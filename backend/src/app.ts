import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cookieParser());

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'https://sy2antek.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('API Running...');
});

import adminRouter from './routes/admin.routes';
import orderRouter from './routes/order.routes';
import technicianRouter from './routes/technician.routes';
import userRouter from './routes/user.router';

app.use('/api/auth', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/admin', adminRouter);
app.use('/api/technicians', technicianRouter);
export default app;
