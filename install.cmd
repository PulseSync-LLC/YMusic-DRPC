@echo off
if %errorlevel% neq 0 (
    pip install -r YandexDiscordRPC/requirements.txt
) else (
    python -m pip install -r YandexDiscordRPC/requirements.txt
)