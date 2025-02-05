# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Create .env file from environment variables
RUN echo "PORT=8000" >> .env \
    && echo "MONGODB_URI=mongodb://mongodb:27017/battle-arena" >> .env \
    && echo "REDIS_HOST=redis" >> .env \
    && echo "REDIS_PORT=6379" >> .env

EXPOSE 8000

CMD ["node", "dist/index.js"]
