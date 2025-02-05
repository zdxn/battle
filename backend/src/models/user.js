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
  role: { 
    type: String, 
    enum: ['user', 'moderator', 'admin'], 
    default: 'user' 
  },
  rank: {
    title: { type: String, default: 'Novice' },
    color: { type: String, default: '#FFFFFF' },
  },
  achievements: [achievementSchema],
  lastOnline: { type: Date },
  status: {
    type: String,
    enum: ['online', 'offline', 'in_battle', 'in_shop'],
    default: 'offline'
  },
  settings: {
    notifications: { type: Boolean, default: true },
    theme: { type: String, default: 'light' },
  }
});

export const User = mongoose.model('User', userSchema);
