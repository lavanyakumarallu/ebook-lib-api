/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { config } from '../config/config';

const getBookList = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Get Book List' });
};

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Create Book' });
};

const getBook = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Get Book' });
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Update Book' });
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Delete Book' });
};

export { getBookList, createBook, getBook, updateBook, deleteBook };
