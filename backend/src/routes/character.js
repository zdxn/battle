import { User } from '../models/user.js';
import { cacheService } from '../redis.js';

const CACHE_TTL = 300; // 5 minutes

export const characterRoutes = async (fastify) => {
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
  fastify.post('/equip/:itemId', async (request) => {
    const { itemId } = request.params;
    const user = await User.findById(request.user.id);
    
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const item = user.character.inventory.find(i => i._id.toString() === itemId);
    if (!item) {
      throw { statusCode: 404, message: 'Item not found' };
    }

    // Unequip current item of same type if exists
    if (item.type in user.character.equipment) {
      const currentEquipped = user.character.equipment[item.type];
      if (currentEquipped) {
        currentEquipped.equipped = false;
      }
    }

    // Equip new item
    item.equipped = true;
    user.character.equipment[item.type] = item;

    await user.save();
    
    // Invalidate cache
    await cacheService.del(`character:${request.user.id}`);

    return user.character;
  });

  // Unequip item
  fastify.post('/unequip/:itemId', async (request) => {
    const { itemId } = request.params;
    const user = await User.findById(request.user.id);
    
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const item = user.character.inventory.find(i => i._id.toString() === itemId);
    if (!item) {
      throw { statusCode: 404, message: 'Item not found' };
    }

    if (!item.equipped) {
      throw { statusCode: 400, message: 'Item is not equipped' };
    }

    // Unequip item
    item.equipped = false;
    user.character.equipment[item.type] = null;

    await user.save();
    
    // Invalidate cache
    await cacheService.del(`character:${request.user.id}`);

    return user.character;
  });
};
