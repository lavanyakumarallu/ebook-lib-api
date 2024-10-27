import app from './src/app';
import { config } from './src/config/config';
import connectDB from './src/config/db';

const startServer = async () => {
  // Connect to DB
  await connectDB();

  const port = config.port || 3000;

  app.listen(port, () => {
    console.log(`Server listing on port: ${port}`);
  });
};

startServer();
