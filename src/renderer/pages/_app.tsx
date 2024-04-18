import React, { useContext, useEffect, useReducer, useState } from 'react'

function app() {
    window.discordRPC.setActivity({
        details: 'test',
        state: `test`,
        largeImageKey: `https://avatars.yandex.net/get-music-content/5280749/e947e174.a.17393402-1/200x200`,
        largeImageText: 'heheheha',
        smallImageKey: 'ym',
        smallImageText: `YaMusicApp v1`,
        startTimestamp: null,
        buttons: [
            {
                label: 'Открыть трек',
                url: `https://music.yandex.ru`,
            },
        ],
    })
    return <div className="app-wrapper">1</div>
}
export default app
