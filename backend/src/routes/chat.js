import { Message } from '../models/message.js';
import { User } from '../models/user.js';
import { chatService, userService } from '../redis.js';

export const chatRoutes = async (fastify) => {
  // Middleware to verify JWT token
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Send private message
  fastify.post('/private', async (request) => {
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

    return message;
  });

  // Get private messages
  fastify.get('/private/:userId', async (request) => {
    const { userId } = request.params;
    const fromId = request.user.id;

    // Get messages from Redis first
    const messages = await chatService.getPrivateMessages(fromId, userId);
    
    if (messages.length === 0) {
      // If no messages in Redis, get from MongoDB
      const dbMessages = await Message.find({
        $or: [
          { from: fromId, to: userId },
          { from: userId, to: fromId }
        ]
      })
      .sort({ timestamp: -1 })
      .limit(50);

      // Store messages in Redis for future quick access
      await Promise.all(dbMessages.map(msg => 
        chatService.storePrivateMessage({
          id: msg._id.toString(),
          from: msg.from.toString(),
          to: msg.to.toString(),
          content: msg.content,
          timestamp: msg.timestamp
        })
      ));

      return dbMessages;
    }

    return messages;
  });

  // Mark messages as read
  fastify.post('/read/:userId', async (request) => {
    const { userId } = request.params;
    const recipientId = request.user.id;

    await Message.updateMany(
      { from: userId, to: recipientId, read: false },
      { $set: { read: true } }
    );

    // Update unread count in user document
    await User.findByIdAndUpdate(recipientId, { $set: { unreadMessages: 0 } });

    return { message: 'Messages marked as read' };
  });

  // Get unread message count
  fastify.get('/unread', async (request) => {
    const userId = request.user.id;
    const user = await User.findById(userId);
    return { unreadCount: user.unreadMessages || 0 };
  });
};
