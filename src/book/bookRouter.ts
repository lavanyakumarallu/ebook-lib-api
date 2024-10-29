import express from 'express';
import {
  getBookList,
  createBook,
  getBook,
  updateBook,
  deleteBook,
} from './bookController';
import multer from 'multer';
import path from 'path';
import authenticate from '../middlewares/authenticate';

const bookRouter = express.Router();

// File Store Local -> Cloud -> Delete Local
const upload = multer({
  dest: path.resolve(__dirname, '../../public/data/uploads'),
  limits: { fieldSize: 1e7 }, // 10mb
});

// Routes
bookRouter.get('/', getBookList);
bookRouter.post(
  '/',
  authenticate,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  createBook
);
bookRouter.get('/:bookId', authenticate, getBook);
bookRouter.patch(
  '/:bookId',
  authenticate,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  updateBook
);
bookRouter.delete('/:bookId', deleteBook);

export default bookRouter;
