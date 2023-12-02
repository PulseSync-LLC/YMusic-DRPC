@echo off
if %errorlevel% neq 0 (
    py .\YandexDiscordRPC\main.py
) else (
    python .\YandexDiscordRPC\main.py
)
