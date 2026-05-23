import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cookieParser());

// Middlewares
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('API Running...');
});

import orderRouter from './routes/order.routes';
import userRouter from './routes/user.router';

app.use('/api/auth', userRouter);
app.use('/api/orders', orderRouter);
export default app;
