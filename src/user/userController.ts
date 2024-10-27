import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import userModel from './userModel';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { config } from '../config/config';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, 'All fields are required');
    return next(error);
  }
  // Database call
  const user = await userModel.findOne({ email });

  if (user) {
    const error = createHttpError(400, 'User already exists with this email.');
    return next(error);
  }

  //   Password hash
  const hashedPassword = await bcrypt.hash(password, 10);

  // process
  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  // Token generation
  const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
    expiresIn: '7d',
  });

  // response
  res.json({ accessToken: token });
};

export { createUser };
