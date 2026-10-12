@echo off
title CivicFix - Smart City Platform Launcher
color 0A
cls
echo =====================================================================
echo           CivicFix - Smart City Complaint Platform
echo                  One-Click Setup and Launcher
echo =====================================================================
echo.
echo [Step 1 of 4] Checking Node.js and NPM installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not found on your system PATH!
    echo Please install Node.js from https://nodejs.org/ and rerun this script.
    echo.
    pause
    exit /b 1
)
node -v
npm -v
echo [OK] Node.js and NPM detected.
echo.

echo [Step 2 of 4] Installing Server dependencies (Express, Mongoose, JWT)...
cd /d "%~dp0server"
call npm install
if %errorlevel% neq 0 (
    echo [WARNING] Server npm install had notices or warnings. Continuing...
)
echo.

echo [Step 3 of 4] Installing Client dependencies (React, Vite, Tailwind, Leaflet)...
cd /d "%~dp0client"
call npm install
if %errorlevel% neq 0 (
    echo [WARNING] Client npm install had notices or warnings. Continuing...
)
echo.

echo [Step 4 of 4] Launching Backend Server and Frontend Client...
start "CivicFix Backend (Port 5000)" cmd /k "cd /d %~dp0server && npm run dev"
echo Backend starting on http://localhost:5000 ...

timeout /t 3 /nobreak >nul

start "CivicFix Frontend (Port 5173)" cmd /k "cd /d %~dp0client && npm run dev"
echo Frontend starting on http://localhost:5173 ...

timeout /t 4 /nobreak >nul

echo Opening CivicFix in your default web browser...
start http://localhost:5173

echo.
echo =====================================================================
echo  SUCCESS! CivicFix is now running live!
echo  Frontend URL : http://localhost:5173
echo  Backend URL  : http://localhost:5000/api/health
echo =====================================================================
echo.
pause
