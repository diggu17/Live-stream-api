const request = require('supertest');
const {app} = require('../src/app.js');

describe('User Signup', () => {
    test('should signup a new user successfully', async () => {
      const newUser = {
        username: 'test1234',
        email: 'test2234@example.com',
        password: 'password123',
      };
  
      const response = await request(app).post('/signup').send(newUser);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  
    // Test case for missing username
    test('should return 400 for missing username', async () => {
      const newUser = {
        email: 'test12@example.com',
        password: 'password123',
      };
  
      const response = await request(app).post('/signup').send(newUser);
      expect(response.statusCode).toBe(400); // Expect bad request
      expect(response.body).toHaveProperty('message'); // Expect error message
    });
  
    // Test case for missing email
    test('should return 400 for missing email', async () => {
      const newUser = {
        username: 'test1234',
        password: 'password123',
      };
  
      const response = await request(app).post('/signup').send(newUser);
      expect(response.statusCode).toBe(400); // Expect bad request
      expect(response.body).toHaveProperty('message'); // Expect error message
    });
  
    // Test case for missing password
    test('should return 400 for missing password', async () => {
      const newUser = {
        username: 'test1234',
        email: 'test12@example.com',
      };
  
      const response = await request(app).post('/signup').send(newUser);
      expect(response.statusCode).toBe(400); // Expect bad request
      expect(response.body).toHaveProperty('message'); // Expect error message
    });
  
    // Add more test cases for other failure scenarios (e.g., username length restrictions, password complexity requirements)
  });
  


describe('User Login', () => {
    test('should login a registered user and return a token', async () => {
      const user = {
        email: 'digvijaysinghthakur17@gmail.com',
        password: 'Digvijay17#',
      };
  
      const response = await request(app).post('/login').send(user);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  
    // Test case for incorrect credentials
    test('should return 400 for incorrect credentials', async () => {
      const user = {
        email: 'digvijaysinghthakur17@gmail.com',
        password: 'wrongPassword', // Incorrect password
      };
  
      const response = await request(app).post('/login').send(user);
      expect(response.statusCode).toBe(400); // Expect bad request
      expect(response.body).toHaveProperty('message'); // Expect error message
    });
  
    // Test case for missing email
    test('should return 404 for missing email', async () => {
      const user = {
        password: 'Digvijay17#', // Missing email
      };
  
      const response = await request(app).post('/login').send(user);
      expect(response.statusCode).toBe(404); // Expect bad request
      expect(response.body).toHaveProperty('message'); // Expect error message
    });
  
    // Add more test cases for other failure scenarios (e.g., invalid email format, missing password)
  });
  
