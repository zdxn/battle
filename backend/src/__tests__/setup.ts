import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Redis } from 'ioredis-mock';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

let mongod: MongoMemoryServer;

// Create Redis mock
export const redisMock = new Redis();

// Setup before all tests
beforeAll(async () => {
  // Create in-memory MongoDB instance
  mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  await mongoose.connect(mongoUri);
});

// Clear database between tests
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
  await redisMock.flushall();
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
