import os
import sys
from pywinauto import application
import psutil
import requests

def start_yandex_music():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    app_path = os.path.join(script_dir, '..', '..', '..', 'YandexMusic', 'Яндекс Музыка.exe')
    app_path = r'{}'.format(app_path)
    app = application.Application(backend="uia").start(
        app_path + ' --remote-debugging-port=9222 --remote-allow-origins=*'
    )
    return app

def get_websocket_url():
    url = 'http://127.0.0.1:9222/json'
    response = requests.get(url)
    json_data = response.json()
    for entry in json_data:
        if 'devtoolsFrontendUrl' in entry and 'webSocketDebuggerUrl' in entry:
            return entry['webSocketDebuggerUrl']

def is_yandex_music_running():
    for process in psutil.process_iter(['pid', 'name']):
        if 'Яндекс Музыка.exe' in process.info['name']:
            return True
    return False
