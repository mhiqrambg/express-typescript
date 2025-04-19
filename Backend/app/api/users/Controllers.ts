import { NextFunction, Request, Response } from 'express';
import { User } from './Models';
import { ValidationError, ModelError } from '../../errors';
import { UsersService } from '../../services/Users';
import { handleError } from '../../utils/handleError';

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
      });

    } catch (error: unknown) {
      handleError(error, next);
    }
  },
  one: async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const user = await UsersService.one(id)

      res.status(200).json({
        success:'success',
        message: 'User retrieved successfully',
        data: user,
      });
    }catch (error: unknown) {
      handleError(error, next);
    }
  },
  create: async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      const user = await UsersService.create({ name, email, password, role: 'user'});
      
      res.status(201).json({
        success: 'success',
        message: 'User created successfully',
        user,
      });
      
    } catch (error: unknown) {
      handleError(error, next);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      const { id } = req.params;
      const user = req.params?.id && await UsersService.update(id, {name, email, password, role:'user'});

      if (!user) {
        throw new ModelError('User not found');
      }
  
      res.status(200).json({
        success: 'success',
        message: 'User updated successfully',
        user,
      });

    } catch (error: unknown) {
      handleError(error, next);
    }
  },
  remove: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const user = await UsersService.remove(id);

      res.status(200).json({
        success:'success',
        message: 'User deleted successfully',
        user,
      })
    }catch (error: unknown) {
      const err = error as Error;
      process.env.NODE_ENV === 'development' && console.error(err.message);
      next(err); // Always pass the error to the error-handling middleware
    }
  },
};
