@echo off
echo Installing project dependencies...

:: Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% neq 0 goto error

:: Install frontend dependencies
echo Installing frontend dependencies...
cd ../frontend
call npm install
if %ERRORLEVEL% neq 0 goto error

echo All dependencies installed successfully!
goto :eof

:error
echo Installation failed with error #%ERRORLEVEL%.
exit /b %ERRORLEVEL%
