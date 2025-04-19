require('dotenv').config();
import { NextFunction, Request, Response } from 'express';
import { AuthError, InternalServerError } from '../errors';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET; 

interface IUser {
  id: string;
  email: string;
  password: string;
  role: string;
}

// Memperluas tipe Request untuk menyertakan properti user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]; // Mengambil token dari header

    if (!token) {
      throw new AuthError('Token tidak ditemukan'); // Jika token tidak ada, lemparkan kesalahan
    }

    if (!secretKey) {
      throw new InternalServerError('Internal Server Error'); 
    }

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        throw new AuthError('Token tidak valid');
      }
      req.user = user as IUser; // Simpan informasi pengguna di request
      next(); // Lanjutkan ke handler berikutnya
    });
  } catch (error) {
    // Tangani kesalahan secara terpusat
    if (error instanceof AuthError) {
      res.status(401).json({ message: error.message });
    } else if (error instanceof InternalServerError) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  }
};
