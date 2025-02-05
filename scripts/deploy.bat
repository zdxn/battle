@echo off
echo Deploying Battle Arena...

REM Stop existing containers
echo Stopping existing containers...
docker-compose down
if %ERRORLEVEL% neq 0 goto error

REM Pull latest changes
echo Pulling latest changes...
git pull
if %ERRORLEVEL% neq 0 goto error

REM Build application
echo Building application...
call scripts\build.bat
if %ERRORLEVEL% neq 0 goto error

REM Start containers
echo Starting containers...
docker-compose up -d
if %ERRORLEVEL% neq 0 goto error

echo Deployment complete! Application is running at http://localhost
goto :eof

:error
echo Failed with error #%ERRORLEVEL%.
exit /b %ERRORLEVEL%
