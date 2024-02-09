from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import webbrowser

class RequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', 'music-application://desktop')
        self.send_header('Access-Control-Allow-Methods', 'POST')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

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
