@echo off
if %errorlevel% neq 0 (
    py .\YandexDiscordRPC\install_dependencies.py
) else (
    python .\YandexDiscordRPC\install_dependencies.py
)
