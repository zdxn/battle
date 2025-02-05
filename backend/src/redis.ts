import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

// Leaderboard methods
export const leaderboardService = {
  async updatePlayerScore(userId: string, username: string, score: number): Promise<void> {
    await redis.zadd('leaderboard:overall', score, `${userId}:${username}`);
  },

  async getTopPlayers(count: number = 10): Promise<Array<{ username: string; score: number }>> {
    const results = await redis.zrevrange('leaderboard:overall', 0, count - 1, 'WITHSCORES');
    const leaderboard = [];
    
    for (let i = 0; i < results.length; i += 2) {
      const [userId, username] = results[i].split(':');
      const score = parseInt(results[i + 1]);
      leaderboard.push({ username, score });
    }
    
    return leaderboard;
  },

  async getPlayerRank(userId: string): Promise<number> {
    const rank = await redis.zrevrank('leaderboard:overall', userId);
    return rank !== null ? rank + 1 : 0;
  }
};

// Chat and message methods
export const chatService = {
  async storePrivateMessage(message: {
    id: string;
    from: string;
    to: string;
    content: string;
    timestamp: Date;
  }): Promise<void> {
    // Store in recipient's message queue
    const recipientKey = `user:${message.to}:messages`;
    await redis.lpush(recipientKey, JSON.stringify(message));
    
    // Store in sender's sent messages
    const senderKey = `user:${message.from}:sent`;
    await redis.lpush(senderKey, JSON.stringify(message));
    
    // Keep only last 100 messages per user
    await redis.ltrim(recipientKey, 0, 99);
    await redis.ltrim(senderKey, 0, 99);
  },

  async getUnreadMessages(userId: string): Promise<any[]> {
    const key = `user:${userId}:messages`;
    const messages = await redis.lrange(key, 0, -1);
    return messages.map(msg => JSON.parse(msg));
  },

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    const key = `message:${messageId}:read`;
    await redis.set(key, 'true');
  },

  async storeGlobalChatMessage(message: {
    id: string;
    from: string;
    content: string;
    timestamp: Date;
    rank?: string;
    flair?: string;
  }): Promise<void> {
    const key = 'chat:global';
    await redis.lpush(key, JSON.stringify(message));
    await redis.ltrim(key, 0, 99); // Keep last 100 global messages
  },

  async getRecentGlobalChat(count: number = 50): Promise<any[]> {
    const messages = await redis.lrange('chat:global', 0, count - 1);
    return messages.map(msg => JSON.parse(msg));
  }
};

// User status and presence
export const userService = {
  async setUserOnline(userId: string, userData: any): Promise<void> {
    await redis.hset('users:online', userId, JSON.stringify({
      ...userData,
      lastSeen: new Date().toISOString()
    }));
  },

  async setUserOffline(userId: string): Promise<void> {
    await redis.hdel('users:online', userId);
    await redis.hset('users:last_seen', userId, new Date().toISOString());
  },

  async getUserStatus(userId: string): Promise<string> {
    const online = await redis.hexists('users:online', userId);
    if (online) return 'online';
    
    const lastSeen = await redis.hget('users:last_seen', userId);
    return lastSeen || 'offline';
  },

  async getOnlineUsers(): Promise<Record<string, any>> {
    const users = await redis.hgetall('users:online');
    return Object.fromEntries(
      Object.entries(users).map(([key, value]) => [key, JSON.parse(value)])
    );
  }
};

// Cache methods
export const cacheService = {
  async set(key: string, value: any, expireSeconds?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (expireSeconds) {
      await redis.setex(key, expireSeconds, stringValue);
    } else {
      await redis.set(key, stringValue);
    }
  },

  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  },

  async delete(key: string): Promise<void> {
    await redis.del(key);
  },

  async setActivePlayer(userId: string, sessionData: any): Promise<void> {
    await redis.hset('active_players', userId, JSON.stringify({
      ...sessionData,
      lastActive: new Date().toISOString()
    }));
  },

  async removeActivePlayer(userId: string): Promise<void> {
    await redis.hdel('active_players', userId);
  },

  async getActivePlayers(): Promise<Record<string, any>> {
    const players = await redis.hgetall('active_players');
    return Object.fromEntries(
      Object.entries(players).map(([key, value]) => [key, JSON.parse(value)])
    );
  }
};

export default redis;
