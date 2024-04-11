@echo off
setlocal

echo Executing extract.bat...
call extract.bat

echo Executing patcher.py...
python patcher.py

echo Install discord-rpc...
call npm.bat

echo Executing build.bat...
call build.bat

echo Executing clear.bat...
call clear.bat

echo All processes completed.

pause
endlocal
