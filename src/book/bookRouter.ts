import express from 'express';
import {
  getBookList,
  createBook,
  getBook,
  updateBook,
  deleteBook,
} from './bookController';

const bookRouter = express.Router();

// Routes
bookRouter.get('/', getBookList);
bookRouter.post('/', createBook);
bookRouter.get('/{id}', getBook);
bookRouter.put('/{id}', updateBook);
bookRouter.delete('/{id}', deleteBook);

export default bookRouter;
