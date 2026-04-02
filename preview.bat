@echo off
setlocal
REM Install deps in C:\RESPOS, start Vite preview (hidden), open preview URL in Google Chrome (browser tab, not PWA).
set "APP=C:\RESPOS"
set "PREVIEW_URL=http://127.0.0.1:4173/"
set "CHROME_DIR=C:\Program Files\Google\Chrome\Application"
set "CHROME_EXE=%CHROME_DIR%\chrome.exe"

if not exist "%APP%\package.json" (
  echo [preview] Missing package.json in %APP%
  echo Copy or install the frontend project there, then try again.
  pause
  exit /b 1
)

if not exist "%CHROME_EXE%" (
  echo [preview] Google Chrome not found:
  echo   %CHROME_EXE%
  echo Install Google Chrome or fix CHROME_DIR in this script.
  pause
  exit /b 1
)

pushd "%APP%"
call npm install
if errorlevel 1 (
  echo [preview] npm install failed.
  popd
  pause
  exit /b 1
)
popd

powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath cmd.exe -WorkingDirectory '%APP%' -ArgumentList '/c','npm run preview' -WindowStyle Hidden"
timeout /t 8 /nobreak >nul
start "" "%CHROME_EXE%" "%PREVIEW_URL%"
exit /b 0
