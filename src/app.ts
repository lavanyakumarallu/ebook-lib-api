/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import globelErrorhandler from './middlewares/globalErrorHandler';
import userRouter from './user/userRouter';

const app = express();
app.use(express.json());

// Routes
app.get('/', (_req, res, next) => {
  res.json({ message: 'Welocome to elib apis' });
});

app.use('/api/users', userRouter);

// Global error hander (Should at last)
app.use(globelErrorhandler);

export default app;
