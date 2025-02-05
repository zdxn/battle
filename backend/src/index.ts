const Fastify = require('fastify');
const cors = require('@fastify/cors');
const jwt = require('@fastify/jwt');
const websocket = require('@fastify/websockets');
const dotenv = require('dotenv');
const setupRoutes = require('./routes.js');
const setupWebSocket = require('./websocket.js');
const connectDB = require('./db.js');

// Load environment variables
dotenv.config();

const start = async () => {
  try {
    // Create Fastify instance
    const fastify = Fastify({
      logger: true,
    });

    // Register plugins
    await fastify.register(cors, {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    });

    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET || 'your-secret-key',
    });

    await fastify.register(websocket);

    // Connect to MongoDB
    await connectDB();

    // Setup routes and WebSocket handlers
    setupRoutes(fastify);
    setupWebSocket(fastify);

    // Start the server
    await fastify.listen({ 
      port: parseInt(process.env.PORT || '8000'),
      host: '0.0.0.0',
    });

    console.log(`Server is running on port ${process.env.PORT || 8000}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
