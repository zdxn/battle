@echo off
echo Checking TypeScript types...

echo Checking backend types...
cd backend
call npm run type-check
if %ERRORLEVEL% neq 0 goto error

echo Checking frontend types...
cd ../frontend
call npm run type-check
if %ERRORLEVEL% neq 0 goto error

echo All TypeScript checks passed!
goto :eof

:error
echo Failed with error #%ERRORLEVEL%.
exit /b %ERRORLEVEL%
