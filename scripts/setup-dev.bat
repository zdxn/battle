@echo off
echo Setting up development environment...

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% neq 0 goto error

REM Install frontend dependencies
echo Installing frontend dependencies...
cd ../frontend
call npm install
if %ERRORLEVEL% neq 0 goto error

REM Start development services
echo Starting MongoDB and Redis...
cd ..
docker-compose up -d mongodb redis
if %ERRORLEVEL% neq 0 goto error

REM Create .env files if they don't exist
echo Creating environment files...
cd backend
if not exist .env (
    echo PORT=8000 > .env
    echo MONGODB_URI=mongodb://localhost:27017/battle-arena >> .env
    echo REDIS_HOST=localhost >> .env
    echo REDIS_PORT=6379 >> .env
    echo JWT_SECRET=development_secret >> .env
    echo FRONTEND_URL=http://localhost:3000 >> .env
)

cd ../frontend
if not exist .env (
    echo REACT_APP_API_URL=http://localhost:8000 > .env
    echo REACT_APP_WS_URL=ws://localhost:8000/ws >> .env
)

echo Development environment setup complete!
echo To start development servers:
echo   1. In backend directory: npm run dev
echo   2. In frontend directory: npm start
goto :eof

:error
echo Failed with error #%ERRORLEVEL%.
exit /b %ERRORLEVEL%
