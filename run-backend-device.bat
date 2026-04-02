@echo off
setlocal

REM Run backend + device server in separate windows.
set "ROOT=%~dp0"

start "POS Backend" cmd /k "cd /d ""%ROOT%backend"" && npm run start"

start "POS Device Server" cmd /k "cd /d ""%ROOT%device"" && npm run start"

exit /b 0
