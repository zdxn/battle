# Production stage
FROM node:18

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Force rebuild of bcrypt
RUN npm install bcrypt --build-from-source

# Install other dependencies
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy source code
COPY . .

# Create .env file from environment variables
RUN echo "PORT=8000" >> .env \
    && echo "MONGODB_URI=mongodb://mongodb:27017/battle-arena" >> .env \
    && echo "REDIS_HOST=redis" >> .env \
    && echo "REDIS_PORT=6379" >> .env

EXPOSE 8000

CMD ["node", "src/index.js"]
