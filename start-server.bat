@echo off
cd /d "%~dp0"
title Thirukkural Server

echo.
echo  Thirukkural - Local Server
echo  ==========================
echo.

where python >nul 2>&1
if errorlevel 1 (
  echo ERROR: Python is not installed or not in PATH.
  echo Install Python from https://python.org and try again.
  pause
  exit /b 1
)

:: Try ports in order until a free one is found
set PORT=
for %%P in (8080 5500 3000 4000 9000 7000) do (
  if not defined PORT (
    netstat -ano | findstr ":%%P " | findstr "LISTENING" >nul 2>&1
    if errorlevel 1 (
      set PORT=%%P
    )
  )
)

if not defined PORT (
  echo ERROR: All default ports are busy. Please free a port and try again.
  pause
  exit /b 1
)

echo  Home:       http://localhost:%PORT%/
echo  Database:   http://localhost:%PORT%/kurals.html
echo  Dashboard:  http://localhost:%PORT%/dashboard.html
echo.
echo  Press Ctrl+C to stop the server.
echo.

start "" "http://localhost:%PORT%/"
python -m http.server %PORT%
