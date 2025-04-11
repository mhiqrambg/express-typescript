import axios from 'axios';
import { GetAllUsersTest } from '../api/users/Models';

/**
 * Service for handling user-related API calls
 */
export const getAllUsers = async (): Promise<GetAllUsersTest> => {
  try {
    const response = await axios.get('/users');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

module.exports = {
  getAllUsers
};