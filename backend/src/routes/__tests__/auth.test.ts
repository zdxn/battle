import { FastifyInstance } from 'fastify';
import { createServer } from '../../server';
import { createTestUser } from '../../__tests__/helpers';
import { User } from '../../models/user';

describe('Auth Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          username: 'newuser',
          password: 'password123',
          email: 'newuser@example.com'
        }
      });

      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.payload)).toHaveProperty('token');
      
      const user = await User.findOne({ username: 'newuser' });
      expect(user).toBeTruthy();
      expect(user?.email).toBe('newuser@example.com');
    });

    it('should not register a user with existing username', async () => {
      await createTestUser({ username: 'existinguser' });

      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          username: 'existinguser',
          password: 'password123',
          email: 'another@example.com'
        }
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.payload)).toHaveProperty('message', 'Username already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await createTestUser({
        username: 'testuser',
        password: 'password123'
      });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          username: 'testuser',
          password: 'password123'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toHaveProperty('token');
    });

    it('should fail with incorrect password', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          username: 'testuser',
          password: 'wrongpassword'
        }
      });

      expect(response.statusCode).toBe(401);
      expect(JSON.parse(response.payload)).toHaveProperty('message', 'Invalid credentials');
    });

    it('should fail with non-existent username', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          username: 'nonexistent',
          password: 'password123'
        }
      });

      expect(response.statusCode).toBe(401);
      expect(JSON.parse(response.payload)).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user data for authenticated user', async () => {
      const user = await createTestUser();
      const token = app.jwt.sign({ id: user._id });

      const response = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        headers: {
          authorization: `Bearer ${token}`
        }
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(payload.username).toBe(user.username);
      expect(payload.email).toBe(user.email);
    });

    it('should fail with invalid token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        headers: {
          authorization: 'Bearer invalid_token'
        }
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
