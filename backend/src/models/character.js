import mongoose from 'mongoose';
const { Schema } = mongoose;

const CharacterSchema = new Schema({
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
    quantity: { type: Number, required: true }
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
    mana: { type: Number, default: 100 },
    maxMana: { type: Number, default: 100 }
  },
  activeFlair: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Methods
CharacterSchema.methods.gainExperience = function(amount) {
  this.experience += amount;
  
  // Check for level up
  const expNeededForNextLevel = this.level * 1000;
  
  if (this.experience >= expNeededForNextLevel) {
    this.level += 1;
    this.experience -= expNeededForNextLevel;
    
    // Increase stats
    this.stats.strength += 2;
    this.stats.dexterity += 2;
    this.stats.intelligence += 2;
    this.stats.vitality += 2;
    
    // Increase max health and mana
    this.status.maxHealth += 20;
    this.status.maxMana += 10;
    
    // Restore health and mana on level up
    this.status.health = this.status.maxHealth;
    this.status.mana = this.status.maxMana;
  }
  
  return this.save();
};

CharacterSchema.methods.addItem = function(itemId, quantity = 1) {
  const inventoryItem = this.inventory.find(item => item.item.equals(itemId));
  
  if (inventoryItem) {
    inventoryItem.quantity += quantity;
  } else {
    this.inventory.push({ item: itemId, quantity });
  }
  
  return this.save();
};

CharacterSchema.methods.removeItem = function(itemId, quantity = 1) {
  const inventoryItem = this.inventory.find(item => item.item.equals(itemId));
  
  if (!inventoryItem || inventoryItem.quantity < quantity) {
    throw new Error('Not enough items');
  }
  
  inventoryItem.quantity -= quantity;
  
  if (inventoryItem.quantity === 0) {
    this.inventory = this.inventory.filter(item => !item.item.equals(itemId));
  }
  
  return this.save();
};

export const Character = mongoose.model('Character', CharacterSchema);
