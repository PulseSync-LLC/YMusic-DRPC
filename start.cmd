@echo off

REM Обновление приложения
call py .\YandexDiscordRPC\updater.py
if %errorlevel% neq 0 (
    echo Failed to update the application. Exiting...
    exit /b %errorlevel%
)

REM Запуск основного приложения
start /B python .\YandexDiscordRPC\main.py
if %errorlevel% neq 0 (
    echo Failed to start the application. Exiting...
    exit /b %errorlevel%
)

echo Application has been closed successfully.
