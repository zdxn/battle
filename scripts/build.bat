@echo off
echo Building Battle Arena...

REM Build backend
echo Building backend...
cd backend
call npm install
call npm run build
if %ERRORLEVEL% neq 0 goto error

REM Build frontend
echo Building frontend...
cd ../frontend
call npm install
call npm run build
if %ERRORLEVEL% neq 0 goto error

REM Build Docker images
echo Building Docker images...
cd ..
docker-compose build
if %ERRORLEVEL% neq 0 goto error

echo Build complete! Run 'docker-compose up' to start the application.
goto :eof

:error
echo Failed with error #%ERRORLEVEL%.
exit /b %ERRORLEVEL%
