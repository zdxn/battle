import { FastifyInstance } from 'fastify';
import { authRoutes } from './routes/auth';
import { characterRoutes } from './routes/character';
import { storeRoutes } from './routes/store';
import { leaderboardRoutes } from './routes/leaderboard';
import { chatRoutes } from './routes/chat';

export const setupRoutes = (fastify: FastifyInstance) => {
  // Register route groups
  fastify.register(authRoutes, { prefix: '/api/auth' });
  fastify.register(characterRoutes, { prefix: '/api/character' });
  fastify.register(storeRoutes, { prefix: '/api/store' });
  fastify.register(leaderboardRoutes, { prefix: '/api/leaderboard' });
  fastify.register(chatRoutes, { prefix: '/api/chat' });

  // Health check route
  fastify.get('/health', async () => {
    return { status: 'ok' };
  });
};
