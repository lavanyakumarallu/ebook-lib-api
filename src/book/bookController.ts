/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { config } from '../config/config';
import cloudinary from '../config/cloudinary';
import path from 'path';

const getBookList = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Get Book List' });
};

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  //   console.log('Files', req.files);
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

    console.log('Book File Upload Result:', bookFileUploadResult);
    res.json({ message: 'Create Book' });
  } catch (error) {
    console.error('Error', error);
    return next(createHttpError(500, 'Error while uploading the files.'));
  }
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
