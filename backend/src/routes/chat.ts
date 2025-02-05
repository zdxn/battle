import { FastifyInstance, FastifyRequest } from 'fastify';
import { Message } from '../models/message';
import { User } from '../models/user';
import { chatService, userService } from '../redis';

interface SendMessageBody {
  to: string;
  content: string;
}

export const chatRoutes = async (fastify: FastifyInstance) => {
  // Middleware to verify JWT token
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Send private message
  fastify.post('/private', async (request: FastifyRequest<{ Body: SendMessageBody }>) => {
    const { to, content } = request.body;
    const fromId = request.user.id;

    // Check if recipient exists
    const recipient = await User.findById(to);
    if (!recipient) {
      throw { statusCode: 404, message: 'Recipient not found' };
    }

    // Create message in database
    const message = new Message({
      from: fromId,
      to,
      content,
      timestamp: new Date()
    });
    await message.save();

    // Store in Redis for quick access
    await chatService.storePrivateMessage({
      id: message._id.toString(),
      from: fromId,
      to,
      content,
      timestamp: message.timestamp
    });

    // Increment unread messages count for recipient
    await User.findByIdAndUpdate(to, { $inc: { unreadMessages: 1 } });

    return { message: 'Message sent successfully' };
  });

  // Get conversation history
  fastify.get('/conversation/:userId', async (request: FastifyRequest<{ Params: { userId: string } }>) => {
    const { userId } = request.params;
    const currentUserId = request.user.id;

    // Get messages between the two users
    const messages = await Message.find({
      $or: [
        { from: currentUserId, to: userId },
        { from: userId, to: currentUserId }
      ]
    })
    .sort({ timestamp: -1 })
    .limit(50)
    .populate('from', 'username rank activeFlair')
    .lean();

    return messages;
  });

  // Get unread messages
  fastify.get('/unread', async (request) => {
    const userId = request.user.id;
    const messages = await chatService.getUnreadMessages(userId);
    return messages;
  });

  // Mark message as read
  fastify.post('/read/:messageId', async (request: FastifyRequest<{ Params: { messageId: string } }>) => {
    const { messageId } = request.params;
    const userId = request.user.id;

    await Message.findByIdAndUpdate(messageId, { read: true });
    await chatService.markMessageAsRead(messageId, userId);
    await User.findByIdAndUpdate(userId, { $inc: { unreadMessages: -1 } });

    return { message: 'Message marked as read' };
  });

  // Admin routes
  fastify.get('/admin/messages', async (request) => {
    // Check if user is admin
    const user = await User.findById(request.user.id);
    if (!user?.isAdmin) {
      throw { statusCode: 403, message: 'Unauthorized' };
    }

    // Get recent messages with user details
    const messages = await Message.find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .populate('from to', 'username')
      .lean();

    return messages;
  });

  // Send global message
  fastify.post('/global', async (request: FastifyRequest<{ Body: { content: string } }>) => {
    const { content } = request.body;
    const user = await User.findById(request.user.id);

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const message = {
      id: new mongoose.Types.ObjectId().toString(),
      from: user.username,
      content,
      timestamp: new Date(),
      rank: user.rank.title,
      flair: user.activeFlair
    };

    await chatService.storeGlobalChatMessage(message);
    return message;
  });

  // Get recent global chat messages
  fastify.get('/global', async () => {
    const messages = await chatService.getRecentGlobalChat();
    return messages;
  });

  // Get user online status
  fastify.get('/status/:userId', async (request: FastifyRequest<{ Params: { userId: string } }>) => {
    const { userId } = request.params;
    const status = await userService.getUserStatus(userId);
    return { status };
  });

  // Get all online users
  fastify.get('/online-users', async () => {
    const users = await userService.getOnlineUsers();
    return users;
  });
};
