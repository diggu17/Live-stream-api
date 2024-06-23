const request = require('supertest');
const { server } = require('../src/app.js'); // Adjust the path to your app
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_CONNECTION_URL;
const testUser = {
  username: 'testuser',
  email: 'abc17@gmail.com',
  password: 'testpassword'
};

let token;


describe('Integration Tests', () => {
  it('should sign up a new user', async () => {
    const response = await request(server)
      .post('/signup')
      .send(testUser);

    expect(response.status).toBe(200); // Adjust based on your actual response status
    expect(response.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should log in the user and return a token', async () => {
    const response = await request(server)
      .post('/login')
      .send(testUser);

    expect(response.status).toBe(200); // Adjust based on your actual response status
    expect(response.body).toHaveProperty('token');
    token = response.body.token; // Save the token for subsequent tests
  });

  it('should allow access to a protected route with a valid token', async () => {
    const response = await request(server)
      .post('/submit-query')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: "rule count('a') > 4 end", string: "ahdvysdb" });

    expect(response.status).toBe(302); // Adjust based on your actual response status
    // expect(response.body).toHaveProperty('message', 'Query processed successfully'); // Adjust based on your actual response
  });

  it('should deny access to a protected route without a token', async () => {
    const response = await request(server)
      .post('/submit-query')
      .send({ query: 'your query here' });

    expect(response.status).toBe(401); // Adjust based on your actual response status
    expect(response.body).toHaveProperty('message', 'Access denied. No token provided.');
  });
});
