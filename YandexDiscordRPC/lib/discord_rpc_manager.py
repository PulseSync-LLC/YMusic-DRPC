from pipes import quote
from pypresence import Presence

def start_discord_rpc(client_id):
    RPC = Presence(client_id)
    RPC.connect()
    return RPC

def update_discord_rpc(RPC, data):
    timecodes = data['timecodes']
    requestImgTrack = data['requestImgTrack']
    playerBarTitle = data['playerBarTitle']
    linkTitleID = data['linkTitle']
    artist = data['artist']
    time_range = f"{timecodes[0]} - {timecodes[1]}" if len(timecodes) == 2 else ""

    time_range_str = str(time_range)

    buttons = [{
        "label": "✌️ Open in YandexMusic",
        "url": f"https://music.yandex.ru/album/{quote(linkTitleID)}"
    }]

    RPC.update(
        state=time_range_str,
        details=str(f"{playerBarTitle} - {artist}"),
        large_image=f"{requestImgTrack[1]}",
        small_image='small_image_key',
        small_text='Small Text',
        buttons=buttons,
    )
