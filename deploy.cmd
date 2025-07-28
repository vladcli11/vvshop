
@echo off
SETLOCAL

SET MESSAGE=deploy: build, commit, push, deploy
IF NOT "%~1"=="" SET MESSAGE=%~1

echo Building project...
call npm run build

IF ERRORLEVEL 1 (
    echo Eroare la build. Oprim scriptul.
    exit /b 1
)

echo Git add + commit...
git add .
git commit -m "%MESSAGE%"

echo Push to GitHub...
git push origin main

echo Deploy to Firebase Hosting...
firebase deploy 

echo Totul e online!
ENDLOCAL
