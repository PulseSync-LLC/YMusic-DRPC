from http.server import BaseHTTPRequestHandler
import json
import webbrowser
from urllib.parse import quote

class RequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', 'music-application://desktop')
        self.send_header('Access-Control-Allow-Methods', 'POST')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        if self.path == '/track_info':
            try:
                with open('YandexDiscordRPC/data.json', 'r', encoding='utf-8') as json_file:
                    data = json.load(json_file)
                    self.wfile.write(json.dumps(data).encode('utf-8'))
            except Exception as e:
                self.wfile.write("Error getting track information".encode('utf-8'))
        else:
            self.wfile.write("Invalid endpoint".encode('utf-8'))

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', 'music-application://desktop')
        self.end_headers()

        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        try:
            data = json.loads(post_data)

            if 'customURL' in data:
                custom_url = data['customURL']
                webbrowser.open(custom_url)
                print("Opening custom URL: {}".format(custom_url))
            else:
                with open('YandexDiscordRPC/data.json', 'w', encoding='utf-8') as json_file:
                    json.dump(data, json_file, ensure_ascii=False)

        except json.decoder.JSONDecodeError as e:
            print("Error decoding JSON data: {}".format(e))
