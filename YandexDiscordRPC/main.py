import asyncio
import json
import os
import threading
import time
from http.server import HTTPServer

from lib.discord_rpc_manager import start_discord_rpc, update_discord_rpc
from lib.application_manager import start_yandex_music, get_websocket_url, is_yandex_music_running
from lib.websocket_manager import execute_js
from lib.logging_config import logger
from lib.request_handler import RequestHandler

def main():
    try:
        app = start_yandex_music()
        websocket_url = get_websocket_url()

        with open('YandexDiscordRPC/discordrpc.js', 'r') as file:
            discordrpc_code = file.read()

        asyncio.run(execute_js(discordrpc_code, websocket_url))

        server_address = ('', 19582)
        httpd = HTTPServer(server_address, RequestHandler)

        client_id = '984031241357647892'
        RPC = start_discord_rpc(client_id)

        rpc_thread = threading.Thread(target=run_discord_rpc, args=(httpd, RPC))
        rpc_thread.start()

        print('Server is running on port 19582...')
        logger.info('Server is running on port 19582...')
        httpd.serve_forever()

    except Exception as e:
        logger.error("An error occurred: %s", e)

def run_discord_rpc(httpd, RPC):

    try:
        while True:
            if not is_yandex_music_running():
                logger.info("Yandex Music is not running. Exiting the script.")
                print('Shutting down the server...')
                httpd.server_close()
                RPC.join(timeout=0.1)
                break

            if os.path.exists('YandexDiscordRPC/data.json') and os.path.getsize('YandexDiscordRPC/data.json') > 0:
                with open('YandexDiscordRPC/data.json', 'r', encoding='utf-8') as json_file:
                    try:
                        data = json.load(json_file)
                        update_discord_rpc(RPC, data)
                    except json.decoder.JSONDecodeError as e:
                        logger.error("Error decoding JSON data: %s", e)
                        time.sleep(0.1)
                        continue
            time.sleep(0.1)  # Уменьшаем задержку между проверками до 0.1 секунды
    except Exception as e:
        logger.exception("An error occurred: %s", e)

if __name__ == "__main__":
    main()
