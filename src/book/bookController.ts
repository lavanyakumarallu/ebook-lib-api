/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { config } from '../config/config';
import cloudinary from '../config/cloudinary';
import path from 'path';
import fs from 'fs';
import bookModel from './bookModel';
import { AuthRequest } from '../middlewares/authenticate';

const getBookList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // todo pagination
    const books = await bookModel.find();
    res.json(books);
  } catch (error) {
    return next(createHttpError(500, 'Error while getting books'));
  }
};

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const files = req.files as { [filename: string]: Express.Multer.File[] };

  const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    '../../public/data/uploads',
    fileName
  );

  const bookFileName = files.file[0].filename;
  const bookFilePath = path.resolve(
    __dirname,
    '../../public/data/uploads',
    bookFileName
  );

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: 'book-covers',
      format: coverImageMimeType,
    });

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: 'raw',
        filename_override: bookFileName,
        folder: 'book-pdfs',
        format: 'pdf',
      }
    );

    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    // Delete temp files
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({ id: newBook._id });
    // res.json({ msg: 'msg' });
  } catch (error) {
    console.error('Error', error);
    return next(createHttpError(500, 'Error while uploading the files.'));
  }
};

const getBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, 'book not found.'));
    }
    res.json(book);
  } catch (error) {
    return next(createHttpError(500, 'Error while getting a book'));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;
  const files = req.files as { [filename: string]: Express.Multer.File[] };

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, 'Book not found'));
  }

  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, 'Unauthorized'));
  }

  let completeCoverImage = '';
  if (files?.coverImage) {
    const filename = files.coverImage[0].filename;
    const coverMimeType = files.coverImage[0].mimetype.split('/').at(-1);
    const filePath = path.resolve(
      __dirname,
      '../../public/data/uploads',
      filename
    );
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: filename,
      folder: 'book-covers',
      format: coverMimeType,
    });
    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  let completeFileName = '';
  if (files?.file) {
    const filename = files.file[0].filename;
    const filePath = path.resolve(
      __dirname,
      '../../public/data/uploads',
      filename
    );
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: filename,
      folder: 'book-pdfs',
      format: 'pdf',
    });
    completeFileName = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    { _id: bookId },
    {
      title,
      genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    { new: true }
  );

  res.json({ book: updatedBook });
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, 'book not found.'));
    }
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, 'Unauthorized'));
    }

    try {
      const coverFileSplits = book.coverImage.split('/');
      const coverImagePublicId =
        coverFileSplits.at(-2) + '/' + coverFileSplits.at(-1)?.split('.').at(0);
      const bookFileSplits = book.file.split('/');
      const bookPublicId = bookFileSplits.at(-2) + '/' + bookFileSplits.at(-1);
      await cloudinary.uploader.destroy(coverImagePublicId);
      await cloudinary.uploader.destroy(bookPublicId, { resource_type: 'raw' });
    } catch (error) {
      return next(createHttpError(500, 'Error while deleting a book files'));
    }
    await bookModel.deleteOne({ _id: bookId });
    res.sendStatus(204);
  } catch (error) {
    return next(createHttpError(500, 'Error while deleting a book'));
  }
};

export { getBookList, createBook, getBook, updateBook, deleteBook };
