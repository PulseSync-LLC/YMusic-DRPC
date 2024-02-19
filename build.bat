@echo off
setlocal

set "source_dir=%LOCALAPPDATA%\Programs\YMusic-DRPC\app"
set "app_asar_path=%LOCALAPPDATA%\Programs\YandexMusic\resources\app.asar"

echo Packing app directory into app.asar...

asar pack "%source_dir%" "%app_asar_path%"
pause
endlocal