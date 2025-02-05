import { FastifyInstance } from 'fastify';
import { createServer } from '../../server';
import { createTestUser, createTestMessage, authenticatedRequest } from '../../__tests__/helpers';
import { Message } from '../../models/message';
import { redisMock } from '../../__tests__/setup';

describe('Chat Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/chat/private', () => {
    it('should create a private message', async () => {
      const sender = await createTestUser({ username: 'sender' });
      const recipient = await createTestUser({ username: 'recipient' });
      const { headers } = await authenticatedRequest(app, sender._id);

      const response = await app.inject({
        method: 'POST',
        url: '/api/chat/private',
        headers,
        payload: {
          to: recipient._id.toString(),
          content: 'Hello!'
        }
      });

      expect(response.statusCode).toBe(200);
      
      const message = await Message.findOne({ 
        from: sender._id,
        to: recipient._id 
      });
      expect(message).toBeTruthy();
      expect(message?.content).toBe('Hello!');
    });

    it('should fail with invalid recipient', async () => {
      const sender = await createTestUser();
      const { headers } = await authenticatedRequest(app, sender._id);

      const response = await app.inject({
        method: 'POST',
        url: '/api/chat/private',
        headers,
        payload: {
          to: 'invalid_id',
          content: 'Hello!'
        }
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /api/chat/conversation/:userId', () => {
    it('should get conversation history between two users', async () => {
      const user1 = await createTestUser({ username: 'user1' });
      const user2 = await createTestUser({ username: 'user2' });
      
      await createTestMessage(user1._id, user2._id, 'Message 1');
      await createTestMessage(user2._id, user1._id, 'Message 2');
      
      const { headers } = await authenticatedRequest(app, user1._id);

      const response = await app.inject({
        method: 'GET',
        url: `/api/chat/conversation/${user2._id}`,
        headers
      });

      expect(response.statusCode).toBe(200);
      const messages = JSON.parse(response.payload);
      expect(messages).toHaveLength(2);
      expect(messages[0].content).toBe('Message 2');
      expect(messages[1].content).toBe('Message 1');
    });
  });

  describe('POST /api/chat/global', () => {
    it('should broadcast global message', async () => {
      const user = await createTestUser();
      const { headers } = await authenticatedRequest(app, user._id);

      const response = await app.inject({
        method: 'POST',
        url: '/api/chat/global',
        headers,
        payload: {
          content: 'Hello everyone!'
        }
      });

      expect(response.statusCode).toBe(200);
      const message = JSON.parse(response.payload);
      expect(message.content).toBe('Hello everyone!');
      expect(message.from).toBe(user.username);
    });
  });

  describe('GET /api/chat/unread', () => {
    it('should get unread messages', async () => {
      const recipient = await createTestUser();
      const sender = await createTestUser();
      
      await createTestMessage(sender._id, recipient._id, 'Unread message');
      
      const { headers } = await authenticatedRequest(app, recipient._id);

      const response = await app.inject({
        method: 'GET',
        url: '/api/chat/unread',
        headers
      });

      expect(response.statusCode).toBe(200);
      const messages = JSON.parse(response.payload);
      expect(messages).toHaveLength(1);
      expect(messages[0].content).toBe('Unread message');
    });
  });

  describe('POST /api/chat/read/:messageId', () => {
    it('should mark message as read', async () => {
      const recipient = await createTestUser();
      const sender = await createTestUser();
      
      const message = await createTestMessage(sender._id, recipient._id, 'Test message');
      
      const { headers } = await authenticatedRequest(app, recipient._id);

      const response = await app.inject({
        method: 'POST',
        url: `/api/chat/read/${message._id}`,
        headers
      });

      expect(response.statusCode).toBe(200);
      
      const updatedMessage = await Message.findById(message._id);
      expect(updatedMessage?.read).toBe(true);
    });
  });
});
