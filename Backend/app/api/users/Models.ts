
import {db} from "../../db/config"
import { ModelError } from "../../errors";

export interface IUser{
    id: String;
    name: string;
    email: string;
    password: string;
    role: string;
    created_at: String;
    updated_at: String;
}

export const User = {
    findAll: async (): Promise<IUser[]> => {
        try {
            const { rows } = await db.query('SELECT * FROM users');
            
            return rows as IUser[];
        } catch (err) {
            console.log(process.env.DATABASE_URL)
            const error = err as Error;
            process.env.NODE_ENV === 'development' && console.log(error.message);
            throw new ModelError('Failed to fetch users');
        }
    },
    create: async (userData: { name: string; email: string; password: string , role: string}): Promise<IUser> => {
        try {
            const { name, email, password ,role} = userData;
            const { rows } = await db.query(
                'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, email, password, role]
            );
            
            return rows[0] as IUser;
        } catch (err) {
            const error = err as Error;
            process.env.NODE_ENV === 'development' && console.log(error.message);
            throw new ModelError('Failed to create user');
        } 
    },
    findOne: async (where: { [key: string]: any }): Promise<IUser> => {
        try {
            // Construct the WHERE clause dynamically
            const conditions = Object.keys(where)
                .map((key, index) => `${key} = $${index + 1}`)
                .join(' AND ');
            const values = Object.values(where);
    
            // Execute the query
            const { rows } = await db.query(
                `SELECT * FROM users WHERE ${conditions}`,
                values
            );
    
            if (rows.length === 0) {
               return null as unknown as IUser;
            }

            return rows[0] as IUser;
    
        } catch (err) {
            const error = err as Error;
            process.env.NODE_ENV === 'development' && console.error(error.message);
            return null as unknown as IUser;
        }
    },
    findByIdAndUpdate: async (
        id: string,
        userData: { name: string; email: string; password: string; role: string }
      ): Promise<IUser> => {
        try {
          const { name, email, password, role } = userData;
      
          // Check if the email already exists for a different user
          const { rows: existingUsers } = await db.query(
            'SELECT id FROM users WHERE email = $1 AND id != $2',
            [email, id]
          );
      
          if (existingUsers.length > 0) {
            throw new ModelError('Email already exists');
          }
      
          // Proceed with the update
          const { rows } = await db.query(
            'UPDATE users SET name = $1, email = $2, password = $3, role = $4 WHERE id = $5 RETURNING *',
            [name, email, password, role, id]
          );
      
          if (rows.length === 0) {
            throw new ModelError('User not found');
          }
      
          return rows[0] as IUser;
        } catch (err: any) {
          if (err.code === '23505') { 
            throw new ModelError('Email already exists');
          }
          const error = err as Error;
          process.env.NODE_ENV === 'development' && console.error(error.message);
          throw new ModelError('Failed to update user');
        }
    },
    delete: async (id: string): Promise<boolean> => {
        try {
          const { rows } = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

          if (rows.length === 0) {
            // throw new ModelError('User not found');
            return false;
          }

          return true;
          
        }catch (err) {
          const error = err as Error;
          process.env.NODE_ENV === 'development' && console.error(error.message);
          throw new ModelError('Failed to delete user');
        }
    } 
}

