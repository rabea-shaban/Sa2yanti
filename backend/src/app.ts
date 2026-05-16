import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('API Running...');
});

import userRouter from './routes/user.router';

app.use('/api/auth', userRouter);

export default app;
