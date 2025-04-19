import { Request, Response, NextFunction } from 'express';
import { ValidationError, InternalServerError, ModelError, AuthError } from '../errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  // Log the error for debugging purposes

  process.env.NODE_ENV === 'development' && console.error('\x1b[31m%s\x1b[0m', `${err.name}: ${err.message}\n${err.stack}`);

  // Handle ValidationError
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Handle InternalServerError
  if (err instanceof InternalServerError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message || 'Internal Server Error',
    });
  }

  // Handle Model error
  if (err instanceof ModelError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Handle Auth error
  if (err instanceof AuthError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Handle unknown errors (fallback)
  res.status(500).json({
    status: 'fail',
    message: 'Something went wrong on the server.',
  });
};
