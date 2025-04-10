import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const ValGlobal = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'fail',
      errors: errors.array(),
    });
    return; // Tambahkan return di sini
  }
  return next(); // Tambahkan return di sini juga
};
