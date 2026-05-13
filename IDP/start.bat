@echo off
echo ============================================
echo   CoastWise India - Starting Full Stack App
echo ============================================

echo.
echo [1/3] Building React frontend...
cd /d "%~dp0frontend"
call npm run build
if %errorlevel% neq 0 (
  echo ERROR: Frontend build failed!
  pause
  exit /b 1
)

echo.
echo [2/3] Compiling backend TypeScript...
cd /d "%~dp0backend"
call npx tsc
if %errorlevel% neq 0 (
  echo ERROR: Backend compile failed!
  pause
  exit /b 1
)

echo.
echo [3/3] Starting integrated server...
echo.
echo ============================================
echo   CoastWise is running at:
echo   http://localhost:3000
echo ============================================
echo.
node dist/index.js
