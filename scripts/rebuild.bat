@echo off
echo Cleaning and rebuilding project...

:: Clean and build backend
echo Cleaning backend...
cd backend
call npm run clean
if %ERRORLEVEL% neq 0 goto error

echo Building backend...
call npm run build
if %ERRORLEVEL% neq 0 goto error

:: Clean and build frontend
echo Cleaning frontend...
cd ../frontend
call npm run build
if %ERRORLEVEL% neq 0 goto error

echo Project rebuilt successfully!
goto :eof

:error
echo Failed with error #%ERRORLEVEL%.
exit /b %ERRORLEVEL%
