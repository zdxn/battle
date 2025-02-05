# Production stage
FROM node:18

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
