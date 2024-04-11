@echo off
setlocal

set "app_asar_path=%LOCALAPPDATA%\Programs\YandexMusic\resources\app.asar"
set "destination_dir=%LOCALAPPDATA%\Programs\YMusic-DRPC\app"

echo %app_asar_path%
echo %destination_dir%

echo Extracting app.asar to %destination_dir%...

asar extract "%app_asar_path%" "%destination_dir%"

pause
endlocal
