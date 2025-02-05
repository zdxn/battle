import { FastifyInstance } from 'fastify';
import { leaderboardService } from '../redis';

export const leaderboardRoutes = async (fastify: FastifyInstance) => {
  // Get top players
  fastify.get('/', async (request) => {
    const count = request.query.count ? parseInt(request.query.count as string) : 10;
    return leaderboardService.getTopPlayers(count);
  });

  // Get player rank
  fastify.get('/rank/:userId', async (request) => {
    const { userId } = request.params as { userId: string };
    const rank = await leaderboardService.getPlayerRank(userId);
    return { rank };
  });

  // Update player score (protected route)
  fastify.post('/update-score', {
    preHandler: fastify.auth([fastify.authenticate]),
    handler: async (request) => {
      const { score } = request.body as { score: number };
      const userId = request.user.id;
      const username = request.user.username;

      await leaderboardService.updatePlayerScore(userId, username, score);
      const rank = await leaderboardService.getPlayerRank(userId);
      
      return { 
        message: 'Score updated successfully',
        rank 
      };
    }
  });
};
