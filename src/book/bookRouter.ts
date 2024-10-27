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

const bookRouter = express.Router();

// File Store Local -> Cloud -> Delete Local
const upload = multer({
  dest: path.resolve(__dirname, '../../public/data/uploads'),
  limits: { fieldSize: 3e7 }, // 30mb
});

// Routes
bookRouter.get('/', getBookList);
bookRouter.post(
  '/',
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  createBook
);
bookRouter.get('/{id}', getBook);
bookRouter.put('/{id}', updateBook);
bookRouter.delete('/{id}', deleteBook);

export default bookRouter;
