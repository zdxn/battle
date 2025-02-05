import mongoose from 'mongoose';
const { Schema } = mongoose;

const ItemSchema = new Schema({
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
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Method to check if a character meets item requirements
ItemSchema.methods.meetsRequirements = function(character) {
  if (this.requirements) {
    if (this.requirements.level && character.level < this.requirements.level) return false;
    if (this.requirements.strength && character.stats.strength < this.requirements.strength) return false;
    if (this.requirements.dexterity && character.stats.dexterity < this.requirements.dexterity) return false;
    if (this.requirements.intelligence && character.stats.intelligence < this.requirements.intelligence) return false;
  }
  return true;
};

export const Item = mongoose.model('Item', ItemSchema);
