import request from "supertest";
import { Server } from 'http';
import { db } from '../db/config';
import app from '../../app';

jest.setTimeout(60000); // Increased timeout for all tests

let server: Server;
let agent: request.Agent;
let createdUserId: string; 

beforeAll(async () => {
  await db.connect(); 
  console.log('Connecting to the database...');
  server = app.listen(0);
  agent = request.agent(server);
});

  // Hapus afterEach yang membersihkan database
  // afterEach(async () => {
  //   await db.clearDatabase();
  // });


  // Bersihkan database hanya setelah semua test selesai
  afterAll(async () => {
    console.log('Cleaning up database...');
    await db.clearDatabase(); // Bersihkan database setelah semua test
    
    console.log('Closing connections...');
    
    // Close server with proper error handling
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          console.error('Error closing server:', err);
          reject(err);
        } else {
          console.log('Server closed successfully');
          resolve();
        }
      });
    });
    
    // Close database connection
    await db.closeConnection();
    
    // Force close any remaining connections
    await new Promise(resolve => setTimeout(resolve, 500));
  });


  const validUser = {
      "name": "Muh Iqram Bahring",
      "email": "mail@muhiqrambahring.com",
      "password": "admin123",
      "re_password": "admin123"
  };

  const invalidUser = {
      "name": "Muh Iqram Bahring",
      "email": "EMAIL",
      "password": "password",
      "re_password": "asdasd"
  };

  const updatedInfo = {
    ...validUser,
    name: 'Updated Name',
    password : 'newpassword123',
    re_password : 'newpassword123',
    // Don't update email to avoid duplication issues
  };

describe('Users API Testing', () => {
    // Test suite untuk create user (POST)
    describe('POST /api/v1/users - Create User', () => {
      test('Should create user with valid input', async () => {
        const response = await agent.post('/api/v1/users')
          .send(validUser)
          .expect('Content-Type', /json/)
          .expect(201);
  
        expect(response.body).toHaveProperty('success', 'success');
        expect(response.body).toHaveProperty('message', 'User created successfully');
        expect(response.body.user).toHaveProperty('name', validUser.name);
        expect(response.body.user).toHaveProperty('email', validUser.email);
        expect(response.body.user).toHaveProperty('id');
        
        // Simpan ID untuk digunakan dalam test berikutnya
        createdUserId = response.body.user.id;
      });
  
      test('Should reject invalid email format', async () => {
        const response = await agent.post('/api/v1/users')
          .send(invalidUser)
          .expect('Content-Type', /json/)
          .expect(400);
          
        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty('errors');
      });
  
      test('Should reject when passwords do not match', async () => {
        const mismatchedPasswords = {
          ...validUser,
          email: "different@example.com",
          re_password: "different123"
        };
        
        const response = await agent.post('/api/v1/users')
          .send(mismatchedPasswords)
          .expect('Content-Type', /json/)
          .expect(400);
          
        expect(response.body).toHaveProperty('status', 'fail');
      });
  
      test('Should reject duplicate email', async () => {
        // Try to create a user with the same email again
        const response = await agent.post('/api/v1/users')
          .send(validUser)
          .expect('Content-Type', /json/)
          .expect(400);
          
        expect(response.body).toHaveProperty('message', 'Email already exists');
      });
    });
  
    // Test suite untuk get users (GET)
    describe('GET /api/v1/users - Retrieve Users', () => {
      test('Should return all users', async () => {
        const response = await agent.get('/api/v1/users')
          .expect('Content-Type', /json/)
          .expect(200);
          
        expect(response.body).toHaveProperty('success', 'success');
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
      });
  
      test('Should return user by ID', async () => {
        // Skip if we don't have a createdUserId from previous test
        if (!createdUserId) {
          console.warn('Skipping get user by ID test - no user ID available');
          return;
        }
  
        const response = await agent.get(`/api/v1/users/${createdUserId}`)
          .expect('Content-Type', /json/)
          .expect(200);
          
        expect(response.body).toHaveProperty('success', 'success');
        expect(response.body.data).toHaveProperty('id', createdUserId);
        expect(response.body.data).toHaveProperty('email', validUser.email);
      });
  
      test('Should return 400 for non-existent user ID', async () => {
        const nonExistentId = 'f173ccd-f03e-44c4-9c5d-a41deab95226';
        const response = await agent.get(`/api/v1/users/${nonExistentId}`)
          .expect(400);
          
        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty('message');
      });
    });
  
    // Test suite untuk update user (PUT/PATCH)
    describe('PUT /api/v1/users/:id - Update User', () => {
      test('Should update user information', async () => {
        // Skip if we don't have a createdUserId from previous test
        if (!createdUserId) {
          console.warn('Skipping update user test - no user ID available');
          return;
        }

        const response = await agent.put(`/api/v1/users/${createdUserId}`)
          .send(updatedInfo)
          .expect('Content-Type', /json/)
          .expect(200);
          
        expect(response.body).toHaveProperty('success', 'success');
        expect(response.body).toHaveProperty('message', 'User updated successfully');
        expect(response.body.user).toHaveProperty('name', updatedInfo.name);

        console.log('udpateInfo.name', updatedInfo.name)
        console.log('response.body.user.name', response.body.user.name)
      });
  
      test('Should reject update with invalid data', async () => {
        if (!createdUserId) return;
  
        const invalidData = {
          email: 'not-an-email'
        };
  
        const response = await agent.put(`/api/v1/users/${createdUserId}`)
          .send(invalidData)
          .expect('Content-Type', /json/)
          .expect(400);
          
        expect(response.body).toHaveProperty('status', 'fail');
      });
  
      test('Should return 400 for updating non-existent user', async () => {
        const nonExistentId = 'd6380745-9414-4266-a8e3-7ca8a25107c4';
        const response = await agent.put(`/api/v1/users/${nonExistentId}`)
          .send({ name: 'New Name' })
          .expect(400);
          
        expect(response.body).toHaveProperty('status', 'fail');
      });
    });
  
    // Test suite untuk delete user (DELETE)
    describe('DELETE /api/v1/users/:id - Delete User', () => {
      test('Should delete user by ID', async () => {
        // Skip if we don't have a createdUserId from previous test
        if (!createdUserId) {
          console.warn('Skipping delete user test - no user ID available');
          return;
        }
  
        const response = await agent.delete(`/api/v1/users/${createdUserId}`)
          .expect('Content-Type', /json/)
          .expect(200);
          
        expect(response.body).toHaveProperty('success', 'success');
        expect(response.body).toHaveProperty('message', 'User deleted successfully');
        console.log('response.body.user.name', response.body.user.name)
        expect(response.body.user).toHaveProperty('name', updatedInfo.name);
      });
  
      test('Should return 400 for deleting non-existent user', async () => {
        const nonExistentId = 'nonexistent123';
        const response = await agent.delete(`/api/v1/users/${nonExistentId}`)
          .expect(400);
          
        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty('message');
      });
  
      test('Should confirm user was deleted', async () => {
        // Skip if we don't have a createdUserId from previous test
        if (!createdUserId) {
          console.warn('Skipping confirmation test - no user ID available');
          return;
        }
  
        const response = await agent.get(`/api/v1/users/${createdUserId}`)
          .expect(400);
          
        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty('message', 'User not found');
      });
    });
  
    // Test suite untuk autentikasi user (jika ada)
    // describe('POST /api/v1/auth/login - User Authentication', () => {
    //   const loginCredentials = {
    //     email: "mail@muhiqrambahring.com",
    //     password: "admin123"
    //   };
  
    //   // Buat user baru untuk testing login
    //   beforeAll(async () => {
    //     const newUser = {
    //       name: "Auth Test User",
    //       email: loginCredentials.email,
    //       password: loginCredentials.password,
    //       re_password: loginCredentials.password
    //     };
  
    //     await agent.post('/api/v1/users')
    //       .send(newUser)
    //       .expect(201);
    //   });
  
    //   test('Should login with valid credentials', async () => {
    //     const response = await agent.post('/api/v1/auth/login')
    //       .send(loginCredentials)
    //       .expect('Content-Type', /json/);
          
    //     // Perlu disesuaikan dengan API sebenarnya
    //     expect(response.body).toHaveProperty('token');
    //     // atau
    //     // expect(response.body).toHaveProperty('success', 'success');
    //   });
  
    //   test('Should reject invalid credentials', async () => {
    //     const invalidCredentials = {
    //       email: loginCredentials.email,
    //       password: "wrongpassword"
    //     };
  
    //     const response = await agent.post('/api/v1/auth/login')
    //       .send(invalidCredentials)
    //       .expect(401);
          
    //     expect(response.body).toHaveProperty('status', 'fail');
    //   });
    // });
  
    // Test suite untuk validasi khusus
    describe('Validation Edge Cases', () => {
      test('Should reject user with empty name', async () => {
        const userWithEmptyName = {
          name: "",
          email: "test@example.com",
          password: "password123",
          re_password: "password123"
        };
  
        const response = await agent.post('/api/v1/users')
          .send(userWithEmptyName)
          .expect(400);
          
        expect(response.body).toHaveProperty('status', 'fail');
      });
  
      test('Should reject user with password too short', async () => {
        const userWithShortPassword = {
          name: "Test User",
          email: "test@example.com",
          password: "short",  // Too short
          re_password: "short"
        };
  
        const response = await agent.post('/api/v1/users')
          .send(userWithShortPassword)
          .expect(400);
          
        expect(response.body).toHaveProperty('status', 'fail');
      });
    });
});