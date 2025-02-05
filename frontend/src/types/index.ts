// Player Types
export interface PlayerStats {
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
}

export interface PlayerRank {
  title: string;
  color: string;
  priority: number;
}

export interface PlayerCombat {
  wins: number;
  losses: number;
}

export interface Player {
  id: string;
  username: string;
  level: number;
  experience: number;
  nextLevelExp: number;
  gold: number;
  stats: PlayerStats;
  rank: PlayerRank;
  combat: PlayerCombat;
  activeFlair?: string;
  unreadMessages: number;
}

// Chat Types
export interface ChatMessage {
  id: string;
  sender: {
    id: string;
    username: string;
    rank?: string;
    flair?: string;
  };
  content: string;
  timestamp: string;
  type: 'global' | 'private';
}

export interface GlobalChatMessage {
  id: string;
  from: string;
  content: string;
  timestamp: string;
  rank?: string;
  flair?: string;
}

export interface PrivateMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// Combat Types
export interface CombatMessage {
  id: string;
  type: 'attack' | 'defense' | 'status' | 'loot' | 'experience';
  content: string;
  timestamp: string;
}

export interface CombatState {
  inCombat: boolean;
  opponent?: Player;
  playerHealth: number;
  opponentHealth: number;
  turn: 'player' | 'opponent';
  status: {
    player: string[];
    opponent: string[];
  };
}

// WebSocket Types
export interface WebSocketMessage {
  type: string;
  payload: any;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  token: string;
  user: Player;
}

// Store Types
export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'weapon' | 'armor' | 'consumable';
  stats?: Partial<PlayerStats>;
  requirements?: Partial<PlayerStats>;
}

export interface InventoryItem extends StoreItem {
  quantity: number;
  equipped: boolean;
}

// Game State Types
export interface GameState {
  player: Player | null;
  inventory: InventoryItem[];
  combat: CombatState;
  onlinePlayers: Player[];
  chatMessages: ChatMessage[];
  unreadMessages: number;
}
