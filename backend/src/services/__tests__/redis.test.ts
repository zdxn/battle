import { redisMock } from '../../__tests__/setup';
import { chatService, userService } from '../../redis';

describe('Redis Services', () => {
  describe('Chat Service', () => {
    beforeEach(async () => {
      await redisMock.flushall();
    });

    describe('storePrivateMessage', () => {
      it('should store private message', async () => {
        const message = {
          id: '1',
          from: 'user1',
          to: 'user2',
          content: 'Hello!',
          timestamp: new Date()
        };

        await chatService.storePrivateMessage(message);
        const messages = await chatService.getUnreadMessages('user2');
        
        expect(messages).toHaveLength(1);
        expect(messages[0].content).toBe('Hello!');
      });
    });

    describe('storeGlobalChatMessage', () => {
      it('should store global message', async () => {
        const message = {
          id: '1',
          from: 'user1',
          content: 'Hello everyone!',
          timestamp: new Date(),
          rank: 'Novice',
          flair: '⚔️'
        };

        await chatService.storeGlobalChatMessage(message);
        const messages = await chatService.getRecentGlobalChat();
        
        expect(messages).toHaveLength(1);
        expect(messages[0].content).toBe('Hello everyone!');
      });

      it('should limit global messages to 100', async () => {
        const messages = Array.from({ length: 110 }, (_, i) => ({
          id: i.toString(),
          from: 'user1',
          content: `Message ${i}`,
          timestamp: new Date(),
          rank: 'Novice',
          flair: '⚔️'
        }));

        for (const message of messages) {
          await chatService.storeGlobalChatMessage(message);
        }

        const storedMessages = await chatService.getRecentGlobalChat();
        expect(storedMessages).toHaveLength(100);
        expect(storedMessages[0].content).toBe('Message 109');
      });
    });

    describe('markMessageAsRead', () => {
      it('should mark message as read', async () => {
        const message = {
          id: '1',
          from: 'user1',
          to: 'user2',
          content: 'Hello!',
          timestamp: new Date()
        };

        await chatService.storePrivateMessage(message);
        await chatService.markMessageAsRead('1', 'user2');
        
        const unreadMessages = await chatService.getUnreadMessages('user2');
        expect(unreadMessages).toHaveLength(0);
      });
    });
  });

  describe('User Service', () => {
    beforeEach(async () => {
      await redisMock.flushall();
    });

    describe('setUserOnline', () => {
      it('should set user as online', async () => {
        const userData = {
          username: 'testuser',
          rank: { title: 'Novice', color: '#fff' },
          flair: '⚔️'
        };

        await userService.setUserOnline('user1', userData);
        const onlineUsers = await userService.getOnlineUsers();
        
        expect(onlineUsers).toHaveProperty('user1');
        expect(onlineUsers.user1).toMatchObject(userData);
      });
    });

    describe('setUserOffline', () => {
      it('should set user as offline', async () => {
        const userData = {
          username: 'testuser',
          rank: { title: 'Novice', color: '#fff' },
          flair: '⚔️'
        };

        await userService.setUserOnline('user1', userData);
        await userService.setUserOffline('user1');
        
        const onlineUsers = await userService.getOnlineUsers();
        expect(onlineUsers).not.toHaveProperty('user1');
      });
    });

    describe('getUserStatus', () => {
      it('should get user status', async () => {
        const userData = {
          username: 'testuser',
          rank: { title: 'Novice', color: '#fff' },
          flair: '⚔️'
        };

        await userService.setUserOnline('user1', userData);
        const status = await userService.getUserStatus('user1');
        
        expect(status).toBe('online');
      });

      it('should return offline for non-existent user', async () => {
        const status = await userService.getUserStatus('nonexistent');
        expect(status).toBe('offline');
      });
    });
  });
});
