import express from 'express';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('API Running...');
});

import userRouter from './routes/user.router';

app.use('/api/auth', userRouter);

export default app;
