import { NextFunction, Request, Response } from 'express';
import { User } from './Models';
import { InternalServerError, ValidationError } from '../../../errors';
import { hashPassword } from '../../../utils/Bcrypt';

interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UsersController {
  get: (req: Request, res: Response, next:NextFunction) => Promise<void>;
  create: (req: Request, res: Response, next:NextFunction) => Promise<void>;
  // Tambahkan metode lain jika diperlukan
}

export const Users: UsersController = {
  get: async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      // Menggunakan metode yang telah dideklarasikan di dalam model
      const users = await User.findAll();
      if (users.length === 0) {
        throw new ValidationError('Users not found');
      }
      res.status(200).json({
        success: 'success',
        message: 'Users retrieved successfully',
        data: users,
      })

    } catch (error: unknown) {
      if(process.env.NODE_ENV === 'development'){
        const err = error as Error;
        next(err);
        return;
      }
    
    }
  },
  create: async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ValidationError('Email already exists');
      }

      const userData: UserCreateInput = {
        name,
        email,
        password,
        role: 'user'
      };

      const user = await User.create(userData);
      
      res.status(201).json({
        success: 'success',
        message: 'User created successfully',
        user,
      });
      
    } catch (error: unknown) {
      if(process.env.NODE_ENV === 'development'){
        const err = error as Error;
        next(err);
        return;
      }
    }
  },
};
