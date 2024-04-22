import { app, ipcMain, Menu, MenuItem, Tray } from 'electron'
import { getNativeImg } from '../utils'
import { Track } from 'yandex-music-client'
import { truncate } from '../../renderer/utils/track'
import { mainWindow } from '../../index'

let tray: Tray
let menu: Menu
const ICON_EXT = '@2x.png'

// const playPauseItem: any = {
//     label: 'Слушать',
//     icon: null,
//     click: () => mainWindow.webContents.send('player-pause'),
// }

function createTray() {
    const icon = getNativeImg('appicon', '.png', 'icon').resize({
        width: 16,
        height: 16,
    })

    tray = new Tray(icon)
    menu = new Menu()

    // menu.append(new MenuItem(playPauseItem))

    menu.append(
        new MenuItem({
            type: 'separator',
        }),
    )

    menu.append(
        new MenuItem({
            label: 'Закрыть',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
            click: app.quit,
        }),
    )
    menu.append(
        new MenuItem({
            label: 'Открыть',
            click: app.show,
        }),
    )

    tray.setContextMenu(menu)
}

// ipcMain.on('player-setTrack', (event, track: Track) => {
//     tray.setTitle(truncate(track.title, 30))
// })

// ipcMain.on('player-playing', (event, playing) => {
//     playPauseItem.icon = playing
//         ? getNativeImg('pause', ICON_EXT, 'touchbar')
//         : getNativeImg('play', ICON_EXT, 'touchbar')
//     playPauseItem.label = playing ? 'Пауза' : 'Слушать'
// })

export default createTray
