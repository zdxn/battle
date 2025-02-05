@echo off
echo Running all tests...

:: Run backend tests
echo Running backend tests...
cd backend
call npm test
if %ERRORLEVEL% neq 0 goto error

:: Run frontend tests
echo Running frontend tests...
cd ../frontend
call npm test
if %ERRORLEVEL% neq 0 goto error

echo All tests passed successfully!
goto :eof

:error
echo Tests failed with error #%ERRORLEVEL%.
exit /b %ERRORLEVEL%
