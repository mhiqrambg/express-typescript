import { NextFunction, Request, Response } from 'express';
import { User } from './Models';
import { InternalServerError, Model, ValidationError } from '../../errors';
import { hashPassword } from '../../utils/Bcrypt';
import {validate as isUUID } from 'uuid';

interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UsersController {
  get: (req: Request, res: Response, next:NextFunction) => Promise<void>;
  create: (req: Request, res: Response, next:NextFunction) => Promise<void>;
  update: (req: Request, res: Response, next:NextFunction) => Promise<void>;
  remove: (req: Request, res: Response, next:NextFunction) => Promise<void>;
  one: (req: Request, res: Response, next:NextFunction) => Promise<void>;
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
  one: async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!isUUID(id)) {
        throw new ValidationError('Invalid ID format');
      }
      
      const user = await User.findOne({id}).then((user) => {
        if (!user) {
          throw new Model('User not found');
        }
        return user;
      })

      res.status(200).json({
        success:'success',
        message: 'User retrieved successfully',
        data: user,
      });
    }catch (error: unknown) {
      const err = error as Error;
      process.env.NODE_ENV === 'development' && console.error(err.message);
      next(err); // Always pass the error to the error-handling middleware
    }
  },
  create: async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new ValidationError('Email already exists');
      }

      const hashedPassword = await hashPassword(password);
      const userData: UserCreateInput = {
        name,
        email,
        password:hashedPassword,
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
  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      const { id } = req.params;

      if (!isUUID(id)) {
        throw new ValidationError('Invalid ID format');
      }

      const hashedPassword = await hashPassword(password);
      const userData: UserCreateInput = {
        name,
        email,
        password: hashedPassword,
        role: 'user',
      };
  
      const existingUser = await User.findByIdAndUpdate(id, userData);
  
      res.status(200).json({
        success: 'success',
        message: 'User updated successfully',
        user: existingUser,
      });
    } catch (error: unknown) {
      const err = error as Error;
      process.env.NODE_ENV === 'development' && console.error(err.message);
      next(err); // Always pass the error to the error-handling middleware
    }
  },
  remove: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ValidationError('ID is required');
      }

      await User.delete(id);

      res.status(200).json({
        success:'success',
        message: 'User deleted successfully',
      })
    }catch (error: unknown) {
      const err = error as Error;
      process.env.NODE_ENV === 'development' && console.error(err.message);
      next(err); // Always pass the error to the error-handling middleware
    }
  },
  
  
};
