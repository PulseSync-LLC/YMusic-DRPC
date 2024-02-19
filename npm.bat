@echo off
setlocal

set "destination_dir=%LOCALAPPDATA%\Programs\YMusic-DRPC\app"

cd %destination_dir%

npm install discord-rpc

pause
endlocal
