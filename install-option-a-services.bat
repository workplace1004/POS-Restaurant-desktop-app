@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Installs backend, device, and PWA host as Windows services (NSSM required).
set "ROOT=%~dp0"
set "NSSM_EXE="
set "NODE_EXE="

for %%I in (nssm.exe) do set "NSSM_EXE=%%~$PATH:I"
if not defined NSSM_EXE (
  if exist "C:\nssm\win64\nssm.exe" set "NSSM_EXE=C:\nssm\win64\nssm.exe"
)
if not defined NSSM_EXE (
  echo [ERROR] nssm.exe not found. Install NSSM and add it to PATH.
  echo         Download: https://nssm.cc/download
  exit /b 1
)

for %%I in (node.exe) do set "NODE_EXE=%%~$PATH:I"
if not defined NODE_EXE (
  echo [ERROR] node.exe not found in PATH.
  exit /b 1
)

echo Using NSSM: "%NSSM_EXE%"
echo Using Node: "%NODE_EXE%"
echo Project root: "%ROOT%"

echo.
echo [1/4] Building PWA...
call npm run build:pwa
if errorlevel 1 exit /b 1

echo.
echo [2/4] Installing production deps for backend/device...
pushd "%ROOT%backend"
call npm ci --omit=dev
if errorlevel 1 (
  popd
  exit /b 1
)
popd
pushd "%ROOT%device"
call npm ci --omit=dev
if errorlevel 1 (
  popd
  exit /b 1
)
popd

echo.
echo [3/4] Registering services...

"%NSSM_EXE%" remove RESPOS-Backend confirm >nul 2>nul
"%NSSM_EXE%" install RESPOS-Backend "%NODE_EXE%" "server.js"
"%NSSM_EXE%" set RESPOS-Backend AppDirectory "%ROOT%backend"
"%NSSM_EXE%" set RESPOS-Backend Start SERVICE_AUTO_START
"%NSSM_EXE%" set RESPOS-Backend AppEnvironmentExtra "PORT=5000"
"%NSSM_EXE%" set RESPOS-Backend AppStdout "%ROOT%logs\backend.out.log"
"%NSSM_EXE%" set RESPOS-Backend AppStderr "%ROOT%logs\backend.err.log"
"%NSSM_EXE%" set RESPOS-Backend AppRotateFiles 1
"%NSSM_EXE%" set RESPOS-Backend AppRotateOnline 1
"%NSSM_EXE%" set RESPOS-Backend AppRotateBytes 10485760

"%NSSM_EXE%" remove RESPOS-Device confirm >nul 2>nul
"%NSSM_EXE%" install RESPOS-Device "%NODE_EXE%" "server.mjs"
"%NSSM_EXE%" set RESPOS-Device AppDirectory "%ROOT%device"
"%NSSM_EXE%" set RESPOS-Device Start SERVICE_AUTO_START
"%NSSM_EXE%" set RESPOS-Device AppEnvironmentExtra "DEVICE_AGENT_PORT=39471"
"%NSSM_EXE%" set RESPOS-Device AppStdout "%ROOT%logs\device.out.log"
"%NSSM_EXE%" set RESPOS-Device AppStderr "%ROOT%logs\device.err.log"
"%NSSM_EXE%" set RESPOS-Device AppRotateFiles 1
"%NSSM_EXE%" set RESPOS-Device AppRotateOnline 1
"%NSSM_EXE%" set RESPOS-Device AppRotateBytes 10485760

"%NSSM_EXE%" remove RESPOS-PWA confirm >nul 2>nul
"%NSSM_EXE%" install RESPOS-PWA "%NODE_EXE%" "scripts\pwa-host.cjs"
"%NSSM_EXE%" set RESPOS-PWA AppDirectory "%ROOT%"
"%NSSM_EXE%" set RESPOS-PWA Start SERVICE_AUTO_START
"%NSSM_EXE%" set RESPOS-PWA AppEnvironmentExtra "PWA_HOST=127.0.0.1" "PWA_PORT=4173"
"%NSSM_EXE%" set RESPOS-PWA AppStdout "%ROOT%logs\pwa.out.log"
"%NSSM_EXE%" set RESPOS-PWA AppStderr "%ROOT%logs\pwa.err.log"
"%NSSM_EXE%" set RESPOS-PWA AppRotateFiles 1
"%NSSM_EXE%" set RESPOS-PWA AppRotateOnline 1
"%NSSM_EXE%" set RESPOS-PWA AppRotateBytes 10485760

echo.
echo [4/4] Starting services...
net start RESPOS-Backend >nul 2>nul
net start RESPOS-Device >nul 2>nul
net start RESPOS-PWA >nul 2>nul

echo.
echo Services installed and started:
echo - RESPOS-Backend  ^(http://127.0.0.1:5000/api/health^)
echo - RESPOS-Device   ^(http://127.0.0.1:39471/device-id^)
echo - RESPOS-PWA      ^(http://127.0.0.1:4173^)
echo.
echo Install the app once from:
echo   http://127.0.0.1:4173
exit /b 0
