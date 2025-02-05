import { FastifyRequest } from 'fastify';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGODB_URI: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      JWT_SECRET: string;
      FRONTEND_URL: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      username: string;
      role: string;
    }
  }
}

// Game Types
interface PlayerStats {
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
}

interface PlayerRank {
  title: string;
  color: string;
  priority: number;
}

interface PlayerCombat {
  wins: number;
  losses: number;
}

interface Player {
  _id: string;
  username: string;
  email: string;
  password: string;
  level: number;
  experience: number;
  gold: number;
  stats: PlayerStats;
  rank: PlayerRank;
  combat: PlayerCombat;
  activeFlair?: string;
  unreadMessages: number;
  lastSeen: Date;
  isAdmin: boolean;
  isModerator: boolean;
}

interface ChatMessage {
  _id: string;
  from: string;
  to?: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface GlobalChatMessage {
  id: string;
  from: string;
  content: string;
  timestamp: Date;
  rank?: string;
  flair?: string;
}

interface RedisMessage {
  id: string;
  from: string;
  to?: string;
  content: string;
  timestamp: Date;
}

interface UserStatus {
  username: string;
  rank?: PlayerRank;
  flair?: string;
  lastSeen?: Date;
}

export {
  Player,
  PlayerStats,
  PlayerRank,
  PlayerCombat,
  ChatMessage,
  GlobalChatMessage,
  RedisMessage,
  UserStatus
};
