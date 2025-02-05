import { FastifyInstance, FastifyRequest } from 'fastify';
import { User } from '../models/user';
import { cacheService } from '../redis';

const CACHE_TTL = 300; // 5 minutes

export const characterRoutes = async (fastify: FastifyInstance) => {
  // Middleware to verify JWT token
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Get character info
  fastify.get('/', async (request) => {
    const cacheKey = `character:${request.user.id}`;
    
    // Try to get from cache first
    const cachedCharacter = await cacheService.get(cacheKey);
    if (cachedCharacter) {
      return cachedCharacter;
    }

    // If not in cache, get from database
    const user = await User.findById(request.user.id).select('-password');
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    // Cache the character data
    await cacheService.set(cacheKey, user.character, CACHE_TTL);
    return user.character;
  });

  // Equip item
  fastify.post('/equip/:itemId', async (request: FastifyRequest<{ Params: { itemId: string } }>) => {
    const { itemId } = request.params;
    const user = await User.findById(request.user.id);
    
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const item = user.character.inventory.find(i => i._id.toString() === itemId);
    if (!item) {
      throw { statusCode: 404, message: 'Item not found' };
    }

    // Unequip any currently equipped item of the same type
    user.character.inventory.forEach(i => {
      if (i.type === item.type) {
        i.equipped = false;
      }
    });

    // Equip the new item
    item.equipped = true;
    await user.save();

    // Update cache
    const cacheKey = `character:${request.user.id}`;
    await cacheService.set(cacheKey, user.character, CACHE_TTL);

    return user.character;
  });

  // Update character stats (for leveling up)
  fastify.post('/level-up', async (request) => {
    const user = await User.findById(request.user.id);
    
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const { character } = user;
    const requiredExp = character.level * 100;

    if (character.experience < requiredExp) {
      throw { statusCode: 400, message: 'Not enough experience to level up' };
    }

    // Level up character
    character.level += 1;
    character.experience -= requiredExp;
    character.stats.health += 10;
    character.stats.attack += 2;
    character.stats.defense += 2;
    character.stats.speed += 1;

    await user.save();

    // Update cache and leaderboard
    const cacheKey = `character:${request.user.id}`;
    await cacheService.set(cacheKey, character, CACHE_TTL);
    await cacheService.setActivePlayer(request.user.id, {
      username: user.username,
      level: character.level,
      stats: character.stats
    });

    return character;
  });
};
