import { FastifyInstance } from 'fastify';
import { User } from '../models/user';
import { Message } from '../models/message';
import { sign } from 'jsonwebtoken';

export const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    username: 'testuser',
    password: 'password123',
    email: 'test@example.com',
    level: 1,
    experience: 0,
    gold: 100,
    stats: {
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      vitality: 10
    },
    rank: {
      title: 'Novice',
      color: '#ffffff',
      priority: 0
    },
    combat: {
      wins: 0,
      losses: 0
    }
  };

  const user = new User({
    ...defaultUser,
    ...overrides
  });

  await user.save();
  return user;
};

export const createTestMessage = async (from: string, to: string, content: string) => {
  const message = new Message({
    from,
    to,
    content,
    timestamp: new Date(),
    read: false
  });

  await message.save();
  return message;
};

export const generateTestToken = (userId: string) => {
  return sign({ id: userId }, process.env.JWT_SECRET || 'test_secret');
};

export const authenticatedRequest = async (app: FastifyInstance, userId?: string) => {
  const user = userId ? { _id: userId } : await createTestUser();
  const token = generateTestToken(user._id.toString());
  
  return {
    headers: {
      authorization: `Bearer ${token}`
    },
    user
  };
};
