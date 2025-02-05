# Battle Arena Game

A multiplayer browser-based battle arena game where players can duel, chat, and progress their characters.

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18 or higher
- npm 8 or higher

### Production Deployment
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd battle-arena
   ```

2. Run the deployment script:
   ```bash
   # Windows
   scripts\deploy.bat

   # Linux/Mac
   ./scripts/deploy.sh
   ```

3. Access the application at http://localhost

### Development Setup
1. Run the development setup script:
   ```bash
   # Windows
   scripts\setup-dev.bat
   ```

2. Start the backend development server:
   ```bash
   cd backend
   npm run dev
   ```

3. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

4. Access the development version at http://localhost:3000

## Project Structure
```
battle-arena/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/      # Custom React hooks
│   │   └── services/   # API services
│   └── public/       # Static assets
├── backend/          # Fastify backend server
│   ├── src/
│   │   ├── models/     # MongoDB models
│   │   ├── routes/     # API routes
│   │   └── services/   # Business logic
│   └── dist/        # Compiled TypeScript
├── scripts/         # Build and deployment scripts
└── docker-compose.yml
```

## Features
- Real-time player interactions
- Global and private chat system
- Character progression
- PvP combat system
- Reactive UI components
- Player stats tracking
- Achievement system

## Available Scripts

### Production
- `scripts/build.bat` - Build the entire application
- `scripts/deploy.bat` - Deploy the application with Docker
- `scripts/build.sh` - Build script for Linux/Mac
- `scripts/deploy.sh` - Deploy script for Linux/Mac

### Development
- `scripts/setup-dev.bat` - Set up development environment
- `npm run dev` (backend) - Start backend development server
- `npm start` (frontend) - Start frontend development server
- `npm run build` - Build for production
- `npm run test` - Run tests

## Environment Variables

### Backend (.env)
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/battle-arena
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_secret_here
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000/ws
```

## Docker Services
- Frontend (Node.js + Nginx)
- Backend (Node.js)
- MongoDB
- Redis

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
MIT
