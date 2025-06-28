@echo off
REM Batch script to set up and run the Next.js app on Windows

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

REM Start the development server
npm run dev
