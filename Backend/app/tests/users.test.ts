import { GetAllUsersTest } from '../api/users/Models';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock response
const mockResponse: GetAllUsersTest = {
  "success": "success",
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "e37db981-93fc-437c-bcac-7fc7da012a3c",
      "name": "MUH. IQRAM BAHRING",
      "email": "admin@gmail.com",
      "password": "$2b$10$FJ4qmS0v1t6EW41y2lqCA.AmPP0I21u7lH29YiJAqgLbX2hK6v0SC",
      "role": "user",
      "created_at": "2025-04-11T05:12:27.581Z",
      "updated_at": "2025-04-11T05:12:27.581Z"
    },
    // ... tambahkan data user lainnya
  ]
};

describe('Users API with mock', () => {
  it('should fetch users successfully', async () => {
    // Setup mock - gunakan mockedAxios bukan axios langsung
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
    
    // Import user service setelah mock
    const userService = require('@services/user.service');
    
    // Panggil fungsi yang akan ditest
    const result = await userService.getAllUsers();
    
    // Validasi hasil
    expect(result).toEqual(mockResponse);
    expect(mockedAxios.get).toHaveBeenCalledWith('/users');
  });
});
