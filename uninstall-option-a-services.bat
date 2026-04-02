@echo off
setlocal

set "NSSM_EXE="
for %%I in (nssm.exe) do set "NSSM_EXE=%%~$PATH:I"
if not defined NSSM_EXE (
  if exist "C:\nssm\win64\nssm.exe" set "NSSM_EXE=C:\nssm\win64\nssm.exe"
)
if not defined NSSM_EXE (
  echo [ERROR] nssm.exe not found. Install NSSM or add it to PATH.
  exit /b 1
)

net stop RESPOS-PWA >nul 2>nul
net stop RESPOS-Device >nul 2>nul
net stop RESPOS-Backend >nul 2>nul

"%NSSM_EXE%" remove RESPOS-PWA confirm >nul 2>nul
"%NSSM_EXE%" remove RESPOS-Device confirm >nul 2>nul
"%NSSM_EXE%" remove RESPOS-Backend confirm >nul 2>nul

echo Removed services: RESPOS-Backend, RESPOS-Device, RESPOS-PWA
exit /b 0
