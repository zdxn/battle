import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  level: number;
  price: number;
  stats?: {
    strength?: number;
    dexterity?: number;
    intelligence?: number;
    vitality?: number;
    damage?: number;
    defense?: number;
  };
  requirements?: {
    level?: number;
    strength?: number;
    dexterity?: number;
    intelligence?: number;
  };
  effects?: Array<{
    type: string;
    value: number;
    duration?: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['weapon', 'armor', 'accessory', 'consumable']
  },
  rarity: {
    type: String,
    required: true,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  level: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  stats: {
    strength: Number,
    dexterity: Number,
    intelligence: Number,
    vitality: Number,
    damage: Number,
    defense: Number
  },
  requirements: {
    level: Number,
    strength: Number,
    dexterity: Number,
    intelligence: Number
  },
  effects: [{
    type: { type: String, required: true },
    value: { type: Number, required: true },
    duration: Number
  }]
}, {
  timestamps: true
});

// Indexes
ItemSchema.index({ name: 1 });
ItemSchema.index({ type: 1 });
ItemSchema.index({ rarity: 1 });
ItemSchema.index({ level: 1 });
ItemSchema.index({ price: 1 });

// Virtual for item power level
ItemSchema.virtual('powerLevel').get(function() {
  let power = 0;
  if (this.stats) {
    power += (this.stats.strength || 0) * 2;
    power += (this.stats.dexterity || 0) * 2;
    power += (this.stats.intelligence || 0) * 2;
    power += (this.stats.vitality || 0) * 2;
    power += (this.stats.damage || 0) * 3;
    power += (this.stats.defense || 0) * 3;
  }
  return power;
});

// Method to check if a character meets item requirements
ItemSchema.methods.meetsRequirements = function(character: any) {
  if (!this.requirements) return true;
  
  if (this.requirements.level && character.level < this.requirements.level) return false;
  if (this.requirements.strength && character.stats.strength < this.requirements.strength) return false;
  if (this.requirements.dexterity && character.stats.dexterity < this.requirements.dexterity) return false;
  if (this.requirements.intelligence && character.stats.intelligence < this.requirements.intelligence) return false;
  
  return true;
};

export const Item = mongoose.model<IItem>('Item', ItemSchema);
