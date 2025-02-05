import { leaderboardService } from '../redis.js';

export const leaderboardRoutes = async (fastify) => {
  // Get top players
  fastify.get('/', async (request) => {
    const count = request.query.count ? parseInt(request.query.count) : 10;
    return leaderboardService.getTopPlayers(count);
  });

  // Get player rank
  fastify.get('/rank/:userId', async (request) => {
    const { userId } = request.params;
    const rank = await leaderboardService.getPlayerRank(userId);
    return { rank };
  });

  // Update player score (protected route)
  fastify.post('/update-score', {
    preHandler: fastify.auth([fastify.authenticate]),
    handler: async (request) => {
      const { score } = request.body;
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
