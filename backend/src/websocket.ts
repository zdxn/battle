import { FastifyInstance } from 'fastify';
import { WebSocket } from 'ws';
import { cacheService, chatService, userService } from './redis';
import { User } from './models/user';
import { Message } from './models/message';

interface ConnectedClient {
  ws: WebSocket;
  userId: string;
  username: string;
  rank?: {
    title: string;
    color: string;
  };
  flair?: string;
}

const connectedClients: ConnectedClient[] = [];

export const setupWebSocket = (fastify: FastifyInstance) => {
  fastify.get('/ws', { websocket: true }, async (connection, req) => {
    const { socket } = connection;

    socket.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        switch (data.type) {
          case 'auth':
            // Verify JWT token and store user info
            try {
              const decoded = await fastify.jwt.verify(data.token);
              const user = await User.findById(decoded.id);
              
              if (!user) {
                socket.send(JSON.stringify({ type: 'error', message: 'User not found' }));
                return;
              }

              const client: ConnectedClient = {
                ws: socket,
                userId: user._id.toString(),
                username: user.username,
                rank: user.rank,
                flair: user.activeFlair
              };
              
              connectedClients.push(client);

              // Set user as online in Redis
              await userService.setUserOnline(user._id.toString(), {
                username: user.username,
                rank: user.rank,
                flair: user.activeFlair
              });

              // Send unread messages
              const unreadMessages = await chatService.getUnreadMessages(user._id.toString());
              if (unreadMessages.length > 0) {
                socket.send(JSON.stringify({
                  type: 'unread_messages',
                  messages: unreadMessages
                }));
              }

              broadcastPlayerList();
            } catch (err) {
              socket.send(JSON.stringify({ type: 'error', message: 'Invalid token' }));
            }
            break;

          case 'private_message':
            const sender = connectedClients.find(c => c.ws === socket);
            if (!sender) {
              socket.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
              return;
            }

            // Create and save message
            const message = new Message({
              from: sender.userId,
              to: data.to,
              content: data.content,
              timestamp: new Date()
            });
            await message.save();

            // Store in Redis
            await chatService.storePrivateMessage({
              id: message._id.toString(),
              from: sender.userId,
              to: data.to,
              content: data.content,
              timestamp: message.timestamp
            });

            // Send to recipient if online
            const recipient = connectedClients.find(c => c.userId === data.to);
            if (recipient) {
              recipient.ws.send(JSON.stringify({
                type: 'private_message',
                message: {
                  id: message._id.toString(),
                  from: {
                    id: sender.userId,
                    username: sender.username,
                    rank: sender.rank,
                    flair: sender.flair
                  },
                  content: data.content,
                  timestamp: message.timestamp
                }
              }));
            } else {
              // Increment unread messages for offline recipient
              await User.findByIdAndUpdate(data.to, { $inc: { unreadMessages: 1 } });
            }
            break;

          case 'global_message':
            const globalSender = connectedClients.find(c => c.ws === socket);
            if (!globalSender) {
              socket.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
              return;
            }

            const globalMessage = {
              id: new Date().getTime().toString(),
              from: globalSender.username,
              content: data.content,
              timestamp: new Date(),
              rank: globalSender.rank,
              flair: globalSender.flair
            };

            // Store in Redis
            await chatService.storeGlobalChatMessage(globalMessage);

            // Broadcast to all connected clients
            broadcastMessage({
              type: 'global_message',
              message: globalMessage
            });
            break;

          case 'mark_read':
            const reader = connectedClients.find(c => c.ws === socket);
            if (!reader) {
              socket.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
              return;
            }

            await Message.findByIdAndUpdate(data.messageId, { read: true });
            await chatService.markMessageAsRead(data.messageId, reader.userId);
            await User.findByIdAndUpdate(reader.userId, { $inc: { unreadMessages: -1 } });
            break;
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });

    socket.on('close', async () => {
      const client = connectedClients.find(c => c.ws === socket);
      if (client) {
        const index = connectedClients.findIndex(c => c.ws === socket);
        connectedClients.splice(index, 1);
        
        // Update Redis
        await userService.setUserOffline(client.userId);
        broadcastPlayerList();
      }
    });
  });
};

async function broadcastMessage(message: any) {
  const messageStr = JSON.stringify(message);
  connectedClients.forEach(client => {
    client.ws.send(messageStr);
  });
}

async function broadcastPlayerList() {
  const onlineUsers = await userService.getOnlineUsers();
  const players = Object.entries(onlineUsers).map(([id, data]) => ({
    id,
    ...data
  }));

  broadcastMessage({
    type: 'player_list',
    players,
  });
}
