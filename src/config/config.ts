import { config as conf } from 'dotenv';
conf();

const _config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  frontendDomain: process.env.FRONTEND_DOMAIN,
  databaseUrl: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  cloudinaryCloud: process.env.CLOUDINARY_CLOUD,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinarySecret: process.env.CLOUDINARY_SECRET,
};

export const config = Object.freeze(_config);
