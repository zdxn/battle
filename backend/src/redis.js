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
  async updatePlayerScore(userId, username, score) {
    await redis.zadd('leaderboard:overall', score, `${userId}:${username}`);
  },

  async getTopPlayers(count = 10) {
    const results = await redis.zrevrange('leaderboard:overall', 0, count - 1, 'WITHSCORES');
    const leaderboard = [];
    
    for (let i = 0; i < results.length; i += 2) {
      const [userId, username] = results[i].split(':');
      const score = parseInt(results[i + 1]);
      leaderboard.push({ username, score });
    }
    
    return leaderboard;
  },

  async getPlayerRank(userId) {
    const rank = await redis.zrevrank('leaderboard:overall', userId);
    return rank !== null ? rank + 1 : 0;
  }
};

// Chat and message methods
export const chatService = {
  async storePrivateMessage(message) {
    const { id, from, to, content, timestamp } = message;
    const messageKey = `message:${id}`;
    const messageData = {
      id,
      from,
      to,
      content,
      timestamp: timestamp.toISOString(),
    };

    await redis.multi()
      .hmset(messageKey, messageData)
      .expire(messageKey, 86400) // 24 hours
      .lpush(`chat:${from}:${to}`, id)
      .lpush(`chat:${to}:${from}`, id)
      .exec();
  },

  async getUnreadMessages(userId) {
    const messageIds = await redis.lrange(`unread:${userId}`, 0, -1);
    return Promise.all(messageIds.map(id => redis.hgetall(`message:${id}`)));
  },

  async markMessageAsRead(messageId, userId) {
    await redis.lrem(`unread:${userId}`, 0, messageId);
  },

  async storeGlobalChatMessage(message) {
    const { id, from, content, timestamp, rank, flair } = message;
    const messageData = {
      id,
      from,
      content,
      timestamp: timestamp.toISOString(),
      ...(rank && { rank }),
      ...(flair && { flair }),
    };

    await redis.multi()
      .hmset(`global:${id}`, messageData)
      .expire(`global:${id}`, 86400)
      .lpush('chat:global', id)
      .exec();
  },

  async getRecentGlobalChat(count = 50) {
    const messageIds = await redis.lrange('chat:global', 0, count - 1);
    return Promise.all(messageIds.map(id => redis.hgetall(`global:${id}`)));
  }
};

// User status and presence
export const userService = {
  async setUserOnline(userId, userData) {
    await redis.multi()
      .hmset(`user:${userId}`, { ...userData, status: 'online' })
      .sadd('users:online', userId)
      .exec();
  },

  async setUserOffline(userId) {
    await redis.multi()
      .hdel(`user:${userId}`, 'status')
      .srem('users:online', userId)
      .exec();
  },

  async getUserStatus(userId) {
    const status = await redis.hget(`user:${userId}`, 'status');
    return status || 'offline';
  },

  async getOnlineUsers() {
    const userIds = await redis.smembers('users:online');
    const users = {};
    
    for (const userId of userIds) {
      users[userId] = await redis.hgetall(`user:${userId}`);
    }
    
    return users;
  }
};

// Cache methods
export const cacheService = {
  async set(key, value, expireSeconds) {
    const serializedValue = JSON.stringify(value);
    
    if (expireSeconds) {
      await redis.setex(key, expireSeconds, serializedValue);
    } else {
      await redis.set(key, serializedValue);
    }
  },

  async get(key) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },

  async delete(key) {
    await redis.del(key);
  },

  async setActivePlayer(userId, sessionData) {
    await redis.multi()
      .hmset(`player:${userId}`, sessionData)
      .sadd('players:active', userId)
      .exec();
  },

  async removeActivePlayer(userId) {
    await redis.multi()
      .del(`player:${userId}`)
      .srem('players:active', userId)
      .exec();
  },

  async getActivePlayers() {
    const playerIds = await redis.smembers('players:active');
    const players = {};
    
    for (const playerId of playerIds) {
      players[playerId] = await redis.hgetall(`player:${playerId}`);
    }
    
    return players;
  }
};

export default redis;
