import { WebSocket } from 'ws';
import { cacheService, chatService, userService } from './redis.js';
import { User } from './models/user.js';
import { Message } from './models/message.js';

const connectedClients = [];

export const setupWebSocket = (fastify) => {
  fastify.get('/ws', { websocket: true }, async (connection, req) => {
    const { socket } = connection;

    socket.on('message', async (message) => {
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

              const client = {
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
                rank: user.rank?.title,
                flair: user.activeFlair
              });

              // Send recent chat history
              const recentMessages = await chatService.getRecentGlobalChat();
              socket.send(JSON.stringify({
                type: 'chat_history',
                messages: recentMessages
              }));

              // Broadcast updated player list
              broadcastPlayerList();
            } catch (err) {
              socket.send(JSON.stringify({ type: 'error', message: 'Invalid token' }));
            }
            break;

          case 'chat':
            // Handle chat message
            const client = connectedClients.find(c => c.ws === socket);
            if (!client) {
              socket.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
              return;
            }

            const messageData = {
              id: Date.now().toString(),
              from: client.username,
              content: data.content,
              timestamp: new Date(),
              rank: client.rank?.title,
              flair: client.flair
            };

            // Store message
            await chatService.storeGlobalChatMessage(messageData);

            // Broadcast to all connected clients
            broadcastMessage({
              type: 'chat',
              message: messageData
            });
            break;

          case 'private_message':
            const sender = connectedClients.find(c => c.ws === socket);
            if (!sender) {
              socket.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
              return;
            }

            // Create and store private message
            const privateMessage = new Message({
              from: sender.userId,
              to: data.to,
              content: data.content
            });
            await privateMessage.save();

            // Store in Redis for quick access
            await chatService.storePrivateMessage({
              id: privateMessage._id.toString(),
              from: sender.userId,
              to: data.to,
              content: data.content,
              timestamp: privateMessage.timestamp
            });

            // Send to recipient if online
            const recipient = connectedClients.find(c => c.userId === data.to);
            if (recipient) {
              recipient.ws.send(JSON.stringify({
                type: 'private_message',
                message: {
                  id: privateMessage._id,
                  from: sender.username,
                  content: data.content,
                  timestamp: privateMessage.timestamp
                }
              }));
            }
            break;
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
        socket.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    socket.on('close', async () => {
      const clientIndex = connectedClients.findIndex(c => c.ws === socket);
      if (clientIndex !== -1) {
        const client = connectedClients[clientIndex];
        
        // Remove from connected clients
        connectedClients.splice(clientIndex, 1);
        
        // Set user as offline in Redis
        await userService.setUserOffline(client.userId);
        
        // Broadcast updated player list
        broadcastPlayerList();
      }
    });
  });
};

function broadcastMessage(message) {
  const messageStr = JSON.stringify(message);
  connectedClients.forEach(client => {
    client.ws.send(messageStr);
  });
}

async function broadcastPlayerList() {
  const onlinePlayers = await userService.getOnlineUsers();
  const playerList = Object.entries(onlinePlayers).map(([id, data]) => ({
    id,
    username: data.username,
    rank: data.rank,
    flair: data.flair
  }));

  broadcastMessage({
    type: 'player_list',
    players: playerList
  });
}
