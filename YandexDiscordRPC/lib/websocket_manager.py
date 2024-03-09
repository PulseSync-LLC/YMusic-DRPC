import asyncio
import json
import websockets

async def execute_js(discordrpc_code, websocket_url):
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
            print("JavaScript code executed successfully.")
        elif 'error' in response_data:
            print("Error executing JavaScript code: {}".format(response_data['error']['message']))
