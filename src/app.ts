/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import createHttpError from 'http-errors';
import globelErrorhandler from './middlewares/globalErrorHandler';

const app = express();

// Routes
app.get('/', (_req, res, next) => {
  const error = createHttpError(400, 'something went wring');
  throw error;
  res.json({ message: 'Welocome to elib apis' });
});

// Global error hander (Should at last)
app.use(globelErrorhandler);

export default app;
