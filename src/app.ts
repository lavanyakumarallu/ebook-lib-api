/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import createHttpError from 'http-errors';
import globelErrorhandler from './middlewares/globalErrorHandler';
import userRouter from './user/userRouter';

const app = express();

// Routes
app.get('/', (_req, res, next) => {
  res.json({ message: 'Welocome to elib apis' });
});

app.use('/api/users', userRouter);

// Global error hander (Should at last)
app.use(globelErrorhandler);

export default app;
