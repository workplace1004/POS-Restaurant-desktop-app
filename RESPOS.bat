@echo off
setlocal
REM Launch RES POS: Vite preview on C:\RESPOS, then open the PWA via the Desktop shortcut
REM (Chrome rewrites --app-id on reinstall; the .lnk always has the current id).
REM Fallback: normal Chrome tab at preview URL if no shortcut is found.
set "APP=C:\RESPOS"
set "PREVIEW_URL=http://127.0.0.1:4173/"
set "CHROME_DIR=C:\Program Files\Google\Chrome\Application"
set "CHROME_EXE=%CHROME_DIR%\chrome.exe"

if not exist "%APP%\package.json" (
  echo [RESPOS] Missing package.json in %APP%
  echo Copy or install the frontend project there, then try again.
  pause
  exit /b 1
)

REM Run Vite preview with no visible console (same env as double-clicking this .bat).
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath cmd.exe -WorkingDirectory '%APP%' -ArgumentList '/c','npm run preview' -WindowStyle Hidden"
timeout /t 5 /nobreak >nul

if exist "%USERPROFILE%\Desktop\RES POS.lnk" (
  start "" "%USERPROFILE%\Desktop\RES POS.lnk"
  exit /b 0
)
if exist "%USERPROFILE%\OneDrive\Desktop\RES POS.lnk" (
  start "" "%USERPROFILE%\OneDrive\Desktop\RES POS.lnk"
  exit /b 0
)
if exist "%PUBLIC%\Desktop\RES POS.lnk" (
  start "" "%PUBLIC%\Desktop\RES POS.lnk"
  exit /b 0
)

if not exist "%CHROME_EXE%" (
  echo [RESPOS] No "RES POS" shortcut found on Desktop and Chrome not found:
  echo   %CHROME_EXE%
  echo Install the PWA again ^(Desktop shortcut "RES POS"^) or install Chrome.
  pause
  exit /b 1
)

start "" "%CHROME_EXE%" "%PREVIEW_URL%"
exit /b 0
