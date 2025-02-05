import { FastifyInstance, FastifyRequest } from 'fastify';
import { User } from '../models/user';

const STORE_ITEMS = [
  {
    id: '1',
    name: 'Steel Sword',
    description: 'A sharp and reliable weapon',
    price: 100,
    type: 'weapon',
    stats: { attack: 15 },
  },
  {
    id: '2',
    name: 'Chain Mail',
    description: 'Protective armor made of interlocking rings',
    price: 150,
    type: 'armor',
    stats: { defense: 12 },
  },
  {
    id: '3',
    name: 'Greater Health Potion',
    description: 'Restores 50 HP',
    price: 50,
    type: 'potion',
    stats: { health: 50 },
  },
  // Add more items as needed
];

export const storeRoutes = async (fastify: FastifyInstance) => {
  // Middleware to verify JWT token
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Get store items
  fastify.get('/', async () => {
    return STORE_ITEMS;
  });

  // Purchase item
  fastify.post('/purchase/:itemId', async (request: FastifyRequest<{ Params: { itemId: string } }>) => {
    const { itemId } = request.params;
    const user = await User.findById(request.user.id);
    
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const item = STORE_ITEMS.find(i => i.id === itemId);
    if (!item) {
      throw { statusCode: 404, message: 'Item not found' };
    }

    if (user.character.gold < item.price) {
      throw { statusCode: 400, message: 'Not enough gold' };
    }

    // Add item to inventory and deduct gold
    user.character.inventory.push({
      name: item.name,
      type: item.type,
      stats: item.stats,
      equipped: false,
    });
    user.character.gold -= item.price;

    await user.save();

    return {
      message: 'Item purchased successfully',
      character: user.character,
    };
  });
};
