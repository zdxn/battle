import { authRoutes } from './routes/auth.js';
import { characterRoutes } from './routes/character.js';
import { storeRoutes } from './routes/store.js';
import { leaderboardRoutes } from './routes/leaderboard.js';
import { chatRoutes } from './routes/chat.js';

export const setupRoutes = (fastify) => {
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
