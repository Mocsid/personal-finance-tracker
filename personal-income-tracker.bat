@echo off
REM Batch script to set up and run the Next.js app on Windows (LAN mode)

REM Check if node_modules exists
IF NOT EXIST node_modules (
    echo Installing dependencies...
    npm install
)

REM Check if Prisma client is generated
IF NOT EXIST ".\node_modules\.prisma\client" (
    echo Generating Prisma client...
    npx prisma generate
)

REM Check if dev.db exists, if not, run migrations
IF NOT EXIST "prisma\dev.db" (
    echo Setting up database...
    npx prisma migrate dev --name init
)

REM Get local IP address
FOR /F "tokens=2 delims=: " %%f IN ('ipconfig ^| findstr /C:"IPv4 Address"') DO set LANIP=%%f

REM Start the development server on all interfaces
npm run dev -- -H 0.0.0.0

echo.
echo App is running! Access it from your PC or any device on your LAN at: http://%LANIP%:3000
pause
