import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['weapon', 'armor', 'potion'], required: true },
  stats: {
    attack: Number,
    defense: Number,
    health: Number,
    speed: Number,
  },
  equipped: { type: Boolean, default: false },
});

const characterSchema = new mongoose.Schema({
  level: { type: Number, required: true, default: 1 },
  experience: { type: Number, required: true, default: 0 },
  gold: { type: Number, required: true, default: 100 },
  stats: {
    health: { type: Number, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    speed: { type: Number, required: true },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
  },
  inventory: [itemSchema],
});

const achievementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  dateUnlocked: { type: Date, required: true },
  icon: { type: String, required: true }, // URL or identifier for the icon
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  character: { type: characterSchema, required: true },
  createdAt: { type: Date, default: Date.now },
  // New fields for enhanced chat and user features
  role: { 
    type: String, 
    enum: ['user', 'moderator', 'admin'], 
    default: 'user' 
  },
  rank: {
    title: { type: String, default: 'Novice' },
    color: { type: String, default: '#FFFFFF' },
    priority: { type: Number, default: 0 }
  },
  achievements: [achievementSchema],
  activeFlair: { type: String, default: null }, // Reference to achievement.icon
  unreadMessages: { type: Number, default: 0 },
  lastSeen: { type: Date },
  settings: {
    chatColor: { type: String, default: '#FFFFFF' },
    notifications: {
      privateMessages: { type: Boolean, default: true },
      challenges: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true }
    }
  }
});

// Virtual for checking if user is admin
userSchema.virtual('isAdmin').get(function() {
  return this.role === 'admin';
});

// Virtual for checking if user is moderator or higher
userSchema.virtual('isModerator').get(function() {
  return ['moderator', 'admin'].includes(this.role);
});

export const User = mongoose.model('User', userSchema);
