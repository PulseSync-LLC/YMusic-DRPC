@echo off
setlocal

echo Executing extract.bat...
call extract.bat

echo Executing patcher.py...
python patcher.py

echo All processes completed.

pause
endlocal
