@echo off
setlocal

set "source_dir=%LOCALAPPDATA%\Programs\YMusic-DRPC\app"

echo Deleting source directory...
rmdir /s /q "%source_dir%"

pause
endlocal