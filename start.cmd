@echo off
if %errorlevel% neq 0 (
    py .\YandexDiscordRPC\updater.py
) else (
    python .\YandexDiscordRPC\updater.py
)
if %errorlevel% neq 0 (
    py .\YandexDiscordRPC\main.py
) else (
    python .\YandexDiscordRPC\main.py
)
