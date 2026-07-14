import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cookieParser());

// Middlewares
app.use(
  cors({
    origin: 'https://sy2antek.vercel.app',
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
