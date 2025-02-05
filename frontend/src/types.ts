export interface Player {
  id: string;
  username: string;
  level: number;
  stats: {
    wins: number;
    losses: number;
    health: number;
    attack: number;
    defense: number;
    speed: number;
  };
  inventory: {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'potion';
    equipped?: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'potion';
  stats: {
    attack?: number;
    defense?: number;
    health?: number;
    speed?: number;
  };
}
