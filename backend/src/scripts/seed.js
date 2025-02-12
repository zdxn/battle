import mongoose from 'mongoose';
import { Item } from '../models/item.js';
import dotenv from 'dotenv';

dotenv.config();

const initialItems = [
  // Weapons
  {
    name: "Wooden Sword",
    description: "A basic training sword",
    type: "weapon",
    rarity: "common",
    level: 1,
    price: 50,
    stats: {
      damage: 5
    }
  },
  {
    name: "Iron Sword",
    description: "A reliable iron sword",
    type: "weapon",
    rarity: "uncommon",
    level: 5,
    price: 200,
    stats: {
      damage: 12,
      strength: 2
    },
    requirements: {
      level: 5
    }
  },
  
  // Armor
  {
    name: "Leather Armor",
    description: "Basic protective gear",
    type: "armor",
    rarity: "common",
    level: 1,
    price: 100,
    stats: {
      defense: 5,
      vitality: 1
    }
  },
  {
    name: "Chain Mail",
    description: "Linked metal rings provide good protection",
    type: "armor",
    rarity: "uncommon",
    level: 5,
    price: 250,
    stats: {
      defense: 12,
      vitality: 2
    },
    requirements: {
      level: 5
    }
  },
  
  // Accessories
  {
    name: "Lucky Charm",
    description: "A small trinket that brings good fortune",
    type: "accessory",
    rarity: "uncommon",
    level: 1,
    price: 150,
    stats: {
      dexterity: 2,
      intelligence: 1
    }
  },
  
  // Consumables
  {
    name: "Health Potion",
    description: "Restores 50 HP",
    type: "consumable",
    rarity: "common",
    level: 1,
    price: 25,
    effects: [
      {
        type: "heal",
        value: 50
      }
    ]
  },
  {
    name: "Strength Elixir",
    description: "Temporarily increases strength",
    type: "consumable",
    rarity: "uncommon",
    level: 5,
    price: 100,
    effects: [
      {
        type: "buff",
        value: 10,
        duration: 300 // 5 minutes
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/battle-arena');
    console.log('Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');

    // Insert new items
    await Item.insertMany(initialItems);
    console.log('Inserted initial items');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
