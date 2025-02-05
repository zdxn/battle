import mongoose, { Schema, Document } from 'mongoose';

export interface ICharacter extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  class: string;
  level: number;
  experience: number;
  gold: number;
  stats: {
    strength: number;
    dexterity: number;
    intelligence: number;
    vitality: number;
  };
  equipment: {
    weapon?: mongoose.Types.ObjectId;
    armor?: mongoose.Types.ObjectId;
    accessory?: mongoose.Types.ObjectId;
  };
  inventory: Array<{
    item: mongoose.Types.ObjectId;
    quantity: number;
  }>;
  skills: Array<{
    name: string;
    level: number;
    experience: number;
  }>;
  achievements: Array<{
    name: string;
    unlockedAt: Date;
  }>;
  status: {
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
  };
  activeFlair?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  class: { type: String, required: true, enum: ['Warrior', 'Mage', 'Rogue'] },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  gold: { type: Number, default: 100 },
  stats: {
    strength: { type: Number, default: 10 },
    dexterity: { type: Number, default: 10 },
    intelligence: { type: Number, default: 10 },
    vitality: { type: Number, default: 10 }
  },
  equipment: {
    weapon: { type: Schema.Types.ObjectId, ref: 'Item' },
    armor: { type: Schema.Types.ObjectId, ref: 'Item' },
    accessory: { type: Schema.Types.ObjectId, ref: 'Item' }
  },
  inventory: [{
    item: { type: Schema.Types.ObjectId, ref: 'Item' },
    quantity: { type: Number, default: 1 }
  }],
  skills: [{
    name: { type: String, required: true },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 }
  }],
  achievements: [{
    name: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now }
  }],
  status: {
    health: { type: Number, default: 100 },
    maxHealth: { type: Number, default: 100 },
    mana: { type: Number, default: 50 },
    maxMana: { type: Number, default: 50 }
  },
  activeFlair: { type: String },
}, {
  timestamps: true
});

// Indexes
CharacterSchema.index({ userId: 1 });
CharacterSchema.index({ name: 1 });
CharacterSchema.index({ level: -1 });

// Methods
CharacterSchema.methods.gainExperience = async function(amount: number) {
  this.experience += amount;
  const experienceToLevel = this.level * 1000;
  
  while (this.experience >= experienceToLevel) {
    this.experience -= experienceToLevel;
    this.level += 1;
    
    // Increase stats on level up
    this.stats.strength += 2;
    this.stats.dexterity += 2;
    this.stats.intelligence += 2;
    this.stats.vitality += 2;
    
    // Increase max health and mana
    this.status.maxHealth = 100 + (this.stats.vitality * 10);
    this.status.maxMana = 50 + (this.stats.intelligence * 5);
    
    // Heal to full on level up
    this.status.health = this.status.maxHealth;
    this.status.mana = this.status.maxMana;
  }
  
  await this.save();
};

CharacterSchema.methods.addItem = async function(itemId: mongoose.Types.ObjectId, quantity: number = 1) {
  const existingItem = this.inventory.find(i => i.item.toString() === itemId.toString());
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.inventory.push({ item: itemId, quantity });
  }
  
  await this.save();
};

CharacterSchema.methods.removeItem = async function(itemId: mongoose.Types.ObjectId, quantity: number = 1) {
  const itemIndex = this.inventory.findIndex(i => i.item.toString() === itemId.toString());
  
  if (itemIndex > -1) {
    if (this.inventory[itemIndex].quantity <= quantity) {
      this.inventory.splice(itemIndex, 1);
    } else {
      this.inventory[itemIndex].quantity -= quantity;
    }
    await this.save();
    return true;
  }
  
  return false;
};

export const Character = mongoose.model<ICharacter>('Character', CharacterSchema);
