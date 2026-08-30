@echo off
title CivicFix - React Dev Server
echo =================================================================
echo        CivicFix - Starting React + Vite Dev Server
echo =================================================================
echo.
cd /d "%~dp0client"
call npm run dev
pause
