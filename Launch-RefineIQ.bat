@echo off
title RefineIQ Desktop Launcher
echo ========================================================
echo   Launching RefineIQ Standalone Desktop Application...
echo ========================================================

set TARGET_URL=https://refineiq.vercel.app

:: 1. Check for Microsoft Edge (installed on all modern Windows machines)
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app=%TARGET_URL%
    exit /b 0
)

if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app=%TARGET_URL%
    exit /b 0
)

:: 2. Check for Google Chrome
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app=%TARGET_URL%
    exit /b 0
)

if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app=%TARGET_URL%
    exit /b 0
)

if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    start "" "%LocalAppData%\Google\Chrome\Application\chrome.exe" --app=%TARGET_URL%
    exit /b 0
)

:: 3. Fallback: Launch default system browser
start %TARGET_URL%
exit /b 0
