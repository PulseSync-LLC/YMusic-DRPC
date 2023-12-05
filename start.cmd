@echo off
if %errorlevel% neq 0 (
    py .\YandexDiscordRPC\updater.py
    py .\YandexDiscordRPC\main.py
) else (
    python .\YandexDiscordRPC\updater.py
    python .\YandexDiscordRPC\main.py
)
