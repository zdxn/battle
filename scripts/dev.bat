@echo off
echo Starting development environment...

:: Start MongoDB (if installed locally)
echo Starting MongoDB...
start "MongoDB" mongod

:: Start Redis (if installed locally)
echo Starting Redis...
start "Redis" redis-server

:: Wait a moment for databases to start
timeout /t 5

:: Start backend in development mode
echo Starting backend...
cd backend
start "Backend" npm run dev

:: Start frontend in development mode
echo Starting frontend...
cd ../frontend
start "Frontend" npm start

echo Development environment is running!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
