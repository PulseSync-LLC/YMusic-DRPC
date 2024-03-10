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
    
    if artist:
        details_str = f"{playerBarTitle} - {artist}"
    else:
        details_str = f"{playerBarTitle}"
        
    if requestImgTrack[1]:
        track_image = f"{requestImgTrack[1]}"
        small_image_set = 'ym'
        buttons = [{
            "label": "✌️ Open in YandexMusic",
            "url": f"https://music.yandex.ru/album/{quote(linkTitleID)}"
        }]
    else:
        track_image = 'ym'
        small_image_set = 'unset'
        buttons = None

    RPC.update(
        state=time_range_str,
        details=details_str,
        large_image=track_image,
        small_image=small_image_set,
        small_text='Yandex Music',
        buttons=buttons,
    )
