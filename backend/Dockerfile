# Production stage
FROM node:18

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Clear npm cache and remove any existing node_modules
RUN npm cache clean --force && \
    rm -rf node_modules

# Install dependencies and rebuild bcrypt
RUN npm install --build-from-source

# Copy source code
COPY . .

# Create .env file from environment variables
RUN echo "PORT=8000" >> .env \
    && echo "MONGODB_URI=mongodb://mongodb:27017/battle-arena" >> .env \
    && echo "REDIS_HOST=redis" >> .env \
    && echo "REDIS_PORT=6379" >> .env

EXPOSE 8000

CMD ["node", "src/index.js"]