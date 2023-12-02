from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import logging
import sys
import webbrowser
import threading
import websockets
import json
import os
from pywinauto import application
from pypresence import Presence
import requests
import psutil

data = {"playerBarTitle": "NaN", "artist": "NaN", "timecodes": ["00:00", "00:00"], "lastRequestUrl": [
    {"url": "https://ya.ru", "idTrack": "https://ya.ru"}], "requestImgTrack": ['null', "ym"]}

with open('YandexDiscordRPC/data.json', 'w', encoding='utf-8') as json_file:
    json.dump(data, json_file, ensure_ascii=False)

logging.basicConfig(filename='YandexDiscordRPC\yandex_music.log', level=logging.INFO,
                    format='%(asctime)s [%(levelname)s] %(message)s')

console_handler = logging.StreamHandler(sys.stdout)
file_handler = logging.FileHandler('YandexDiscordRPC\yandex_music.log')

console_handler.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')

console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

logger = logging.getLogger()

logger.addHandler(console_handler)
logger.addHandler(file_handler)

app_path = r'.\\.\\Яндекс Музыка.exe'

app = application.Application(backend="uia").start(
    app_path + ' --remote-debugging-port=9222 --remote-allow-origins=*')


def is_yandex_music_running():
    """Check if the Yandex Music process is running."""
    for process in psutil.process_iter(['pid', 'name']):
        if 'Яндекс Музыка.exe' in process.info['name']:
            return True
    return False


try:
    app.wait_cpu_usage_lower(threshold=1, timeout=60)

    time.sleep(2)

    main_window = app.window(title_re=".*Яндекс.Музыка.*")

    def get_websocket_url():
        url = 'http://127.0.0.1:9222/json'
        response = requests.get(url)
        json_data = response.json()

        for entry in json_data:
            if 'devtoolsFrontendUrl' in entry and 'webSocketDebuggerUrl' in entry:
                return entry['webSocketDebuggerUrl']

    websocket_url = get_websocket_url()

    if websocket_url:
        with open('YandexDiscordRPC\discordrpc.js', 'r') as file:
            discordrpc_code = file.read()

        async def execute_js():
            async with websockets.connect(websocket_url) as ws:
                payload = {
                    "id": 1,
                    "method": "Runtime.evaluate",
                    "params": {
                        "expression": discordrpc_code
                    }
                }

                await ws.send(json.dumps(payload))

                response = await ws.recv()
                response_data = json.loads(response)

                if 'result' in response_data:
                    logger.info("JavaScript code executed successfully.")
                elif 'error' in response_data:
                    logger.error("Error executing JavaScript code: %s",
                                 response_data['error']['message'])

        import asyncio
        asyncio.run(execute_js())
    else:
        logger.error("WebSocket URL not found.")

except Exception as e:
    logger.error("An error occurred: %s", e)


class RequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin',
                         'music-application://desktop')
        self.send_header('Access-Control-Allow-Methods', 'POST')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Access-Control-Allow-Origin',
                         'music-application://desktop')
        self.end_headers()

        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        with open('YandexDiscordRPC/data.json', 'w', encoding='utf-8') as json_file:
            json.dump(data, json_file, ensure_ascii=False)


server_address = ('', 19582)
client_id = '984031241357647892'
RPC = Presence(client_id)
RPC.connect()

script_dir = os.path.dirname(os.path.abspath(__file__))
data_file_path = os.path.join(script_dir, 'data.json')


def run_discord_rpc():
    try:
        while True:
            if not is_yandex_music_running():
                logger.info("Yandex Music is not running. Exiting the script.")
                print('Shutting down the server...')
                httpd.server_close()
                discord_rpc_thread.join(timeout=5)
                break

            if os.path.exists(data_file_path) and os.path.getsize(data_file_path) > 0:
                with open(data_file_path, 'r', encoding='utf-8') as json_file:
                    data = json.load(json_file)

                    timecodes = data['timecodes']
                    lastRequestUrl = data['lastRequestUrl']
                    requestImgTrack = data['requestImgTrack']
                    time_range = f"{timecodes[0]} - {timecodes[1]}" if len(
                        timecodes) == 2 else ""

                    time_range_str = str(time_range)

                    id_track = lastRequestUrl[0]['idTrack']

                    buttons = [
                        {"label": "✌️ Open In Browser",
                            "url": f"https://music.yandex.ru/track/{id_track}"},
                    ]

                    RPC.update(
                        state=time_range_str,
                        details=data['artist'] + " - " +
                        data['playerBarTitle'],
                        large_image=f"{requestImgTrack[1]}",
                        small_image='small_image_key',
                        small_text='Small Text',
                        buttons=buttons,
                    )
            time.sleep(1)
    finally:
        RPC.close()


discord_rpc_thread = threading.Thread(target=run_discord_rpc)
discord_rpc_thread.start()

httpd = HTTPServer(server_address, RequestHandler)

try:
    print('Server is running on port 19582...')
    httpd.serve_forever()
except KeyboardInterrupt:
    print('Shutting down the server...')
    httpd.server_close()
    discord_rpc_thread.join(timeout=5)
