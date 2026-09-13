@echo off
setlocal
title DearSelf V38 - Start

cd /d "%~dp0"

echo.
echo  ========================================
echo       DearSelf V38 - Web App Launcher
echo  ========================================
echo.

where python >nul 2>&1
if %errorlevel%==0 goto START

where py >nul 2>&1
if %errorlevel%==0 goto START_PY

echo Python was not found on this computer.
echo.
echo Please install Python, then run this file again.
echo https://www.python.org/downloads/
pause
exit /b 1

:START
set "PYTHON_CMD=python"
goto RUN

:START_PY
set "PYTHON_CMD=py"
goto RUN

:RUN
echo Starting DearSelf at http://localhost:8000
echo.
echo Keep this window open while using the local DearSelf web app.
echo Close this window to stop the local server.
echo.

start "" "http://localhost:8000"

%PYTHON_CMD% -m http.server 8000 --bind 127.0.0.1
pause
