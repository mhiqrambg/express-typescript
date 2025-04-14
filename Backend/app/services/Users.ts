import { User } from '../api/users/Models';
import { ValidationError, ModelError } from '../errors/index';
import {validate as isUUID } from 'uuid';
import { hashPassword } from '../utils/Bcrypt';

interface UserCreateInput {
    name: string;
    email: string;
    password: string;
    role: string;
}

export const UsersService = {
    create: async (userData: UserCreateInput) => {
        
        const existingUser = await User.findOne({ email: userData.email });
        const hashPassworded = await hashPassword(userData.password);
        if (existingUser) {
            throw new ValidationError('Email already exists');
        }
        
        const user = await User.create({ ...userData, password: hashPassworded });
        console.log('Service Berjalan', user)
        return user;
    },
    update: async (id: string, userData: UserCreateInput) => {
        const {name, email, password, role} = userData;
        if (!isUUID(id)) {
            throw new ValidationError('Invalid ID format');
          }

        if (!name || !email || !password || !role) {
            throw new ValidationError('All fields are required');
        }

        if (email) {
            const checkEmail = await User.findOne({ email });

            if (checkEmail && checkEmail.id !== id) {
                throw new ValidationError('Email already exists');
            }
        }

        const hashPassworded = await hashPassword(userData.password);
        const existingUser = await User.findByIdAndUpdate(id, {...userData, password: hashPassworded});
        return existingUser;
    },
    one: async (id: string) => {
         if (!isUUID(id)) {
            throw new ValidationError('Invalid ID format');
          }
         const user = await User.findOne({ id });
         if (!user) {
            throw new ModelError('User not found');
          }
          return user;
    },
    remove: async (id: string) => {
        if (!isUUID(id)) {
            throw new ValidationError('Invalid ID format');
        }
        if (!id) {
            throw new ValidationError('ID is required');
        }

        const response = await User.findOne({ id });

        if (!response) {
          throw new ModelError ('User not found');
        }
 
        const user = await User.delete(id);
        if (!user) {
            throw new ModelError('User not found2');
          }
        return user && response;
    },
}


