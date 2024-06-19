import {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    Tray,
    shell,
    session,
    protocol,
    dialog,
} from 'electron'
import process from 'process'
import { getNativeImg } from './main/utils'
import './main/modules/index'
import path from 'path'
import systeminformation from 'systeminformation'
import fs from 'fs'
import { store } from './main/modules/storage'
import Patcher from './main/modules/patcher/patch'
import UnPatcher from './main/modules/patcher/unpatch'
import createTray from './main/modules/tray'
import rpc_connect from './main/modules/discordRpc'
import corsAnywhereServer from 'cors-anywhere'
import getPort from 'get-port'

import {
    handleDeeplink,
    handleDeeplinkOnApplicationStartup,
} from './main/modules/handleDeepLink'
import { checkForSingleInstance } from './main/modules/singleInstance'
import * as Sentry from '@sentry/electron/main'
import { getTrackInfo } from './main/modules/httpServer'
import { getUpdater } from './main/modules/updater/updater'
import checkAndTerminateYandexMusic, {
    startYandexMusic,
} from '../utils/processUtils'
import https from 'https'
import { Track } from 'yandex-music-client'
import { getPercent } from './renderer/utils/percentage'
import os from 'os'
import { v4 } from 'uuid'
import TrackInterface from './renderer/api/interfaces/track.interface'
import {isDev} from "./renderer/api/config";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

declare const PRELOADER_PRELOAD_WEBPACK_ENTRY: string
declare const PRELOADER_WEBPACK_ENTRY: string

const isMac = process.platform === 'darwin'
export let corsAnywherePort: string | number
export let mainWindow: BrowserWindow
let preloaderWindow: BrowserWindow

const ydrpcModification = path.join(
    process.env.LOCALAPPDATA,
    'YDRPC Modification',
)

if (!fs.existsSync(ydrpcModification)) {
    fs.mkdirSync(ydrpcModification)
}

const themesDir = path.join(ydrpcModification, 'themes')

if (!fs.existsSync(themesDir)) {
    fs.mkdirSync(themesDir)
}

const confFilePath = path.join(themesDir, 'conf.json')

if (!fs.existsSync(confFilePath)) {
    fs.writeFileSync(
        confFilePath,
        JSON.stringify({ select: 'default' }, null, 4),
    )
}
const icon = getNativeImg('appicon', '.png', 'icon').resize({
    width: 40,
    height: 40,
})
const updater = getUpdater()

Sentry.init({
    dsn: 'https://6aaeb7f8130ebacaad9f8535d0c77aa8@o4507369806954496.ingest.de.sentry.io/4507369809182800',
    enableRendererProfiling: true,
    enableTracing: true,
})
const createWindow = (): void => {
    preloaderWindow = new BrowserWindow({
        width: 250,
        height: 271,
        backgroundColor: '#08070d',
        show: false,
        resizable: false,
        fullscreenable: false,
        movable: true,
        frame: false,
        alwaysOnTop: true,
        transparent: false,
        roundedCorners: true,
        webPreferences: {
            preload: PRELOADER_PRELOAD_WEBPACK_ENTRY,
            contextIsolation: true,
            devTools: false,
            nodeIntegration: true,
        },
    })

    preloaderWindow.loadURL(PRELOADER_WEBPACK_ENTRY)
    preloaderWindow.once('ready-to-show', () => preloaderWindow.show())

    // Create the browser window.
    mainWindow = new BrowserWindow({
        show: false,
        frame: isMac,
        backgroundColor: '#1B1F21',
        width: 810,
        height: 690,
        minWidth: 810,
        minHeight: 690,
        transparent: false,
        //maxWidth: 615,
        icon,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            devTools: true,
            nodeIntegration: true,
        },
    })
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).catch(e => {
        console.error(e)
    })

    mainWindow.once('ready-to-show', () => {
        preloaderWindow.close()
        preloaderWindow.destroy()
        if (!store.get('autoStartInTray')) {
            mainWindow.show()
            mainWindow.moveTop()
        }
    })
    mainWindow.webContents.setWindowOpenHandler(electronData => {
        shell.openExternal(electronData.url)
        return { action: 'deny' }
    })
    //mainWindow.webContents.openDevTools()
}
const corsAnywhere = async () => {
    corsAnywherePort = await getPort()

    corsAnywhereServer.createServer().listen(corsAnywherePort, 'localhost')
}
protocol.registerSchemesAsPrivileged([
    {
        scheme: 'http',
        privileges: {
            standard: true,
            bypassCSP: true,
            allowServiceWorkers: true,
            supportFetchAPI: true,
            corsEnabled: true,
            stream: true,
        },
    },
    {
        scheme: 'ws',
        privileges: {
            standard: true,
            bypassCSP: true,
            allowServiceWorkers: true,
            supportFetchAPI: true,
            corsEnabled: true,
            stream: true,
        },
    },
    {
        scheme: 'wss',
        privileges: {
            standard: true,
            bypassCSP: true,
            allowServiceWorkers: true,
            supportFetchAPI: true,
            corsEnabled: true,
            stream: true,
        },
    },
    {
        scheme: 'https',
        privileges: {
            standard: true,
            bypassCSP: true,
            allowServiceWorkers: true,
            supportFetchAPI: true,
            corsEnabled: true,
            stream: true,
        },
    },
    { scheme: 'mailto', privileges: { standard: true } },
])

app.on('ready', async () => {
    await prestartCheck()
    await corsAnywhere()
    createWindow() // Все что связано с mainWindow должно устанавливаться после этого метода
    checkForSingleInstance()
    handleDeeplinkOnApplicationStartup()
    handleDeeplink(mainWindow)
    createTray()
    updater.start()
    updater.onUpdate(version => {
        mainWindow.webContents.send('update-available', version)
    })
})
app.whenReady().then(async () => {
    if(isDev) {
        await session.defaultSession.loadExtension(
            path.join(
                process.env.LOCALAPPDATA,
                'Google',
                'Chrome',
                'User Data',
                'Profile 1',
                'Extensions',
                'fmkadmapgofadopljbjfkapdkoienihi',
                '5.2.0_0',
            ),
        )
    }
})
async function prestartCheck() {
    const musicDir = app.getPath('music')
    if (!fs.existsSync(path.join(musicDir, 'PulseSyncMusic'))) {
        fs.mkdirSync(path.join(musicDir, 'PulseSyncMusic'))
    }
    const asarCopy = path.join(
        process.env.LOCALAPPDATA,
        'Programs',
        'YandexMusic',
        'resources',
        'app.asar.copy',
    )

    if (store.has('discordRpc') && store.get('discordRpc')) {
        rpc_connect()
    }
    if (store.has('patched') && store.get('patched')) {
        if (!fs.existsSync(asarCopy)) {
            store.set('patched', false)
        }
    } else if (fs.existsSync(asarCopy)) {
        store.set('patched', true)
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        ipcMain.emit('discordrpc-clearstate')
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on('update-install', () => {
    updater.install()
})

ipcMain.on('electron-window-minimize', () => {
    mainWindow.minimize()
})

ipcMain.on('electron-window-maximize', () => {
    if (mainWindow.isMaximized()) mainWindow.unmaximize()
    else mainWindow.maximize()
})

ipcMain.on('electron-window-close', () => {
    mainWindow.hide()
})

ipcMain.on('electron-patch', async () => {
    console.log('patch')
    setTimeout(async () => {
        await Patcher.patchRum().then(async () => {
            console.log('Все гуд')
            store.set('patched', true)
        })
    }, 3000)
})

ipcMain.on('electron-repatch', async () => {
    console.log('repatch')
    setTimeout(async () => {
        await UnPatcher.unpatch().then(async () => {
            console.log('Все гуд')
            Patcher.patchRum().then(async () => store.set('patched', true))
        })
    }, 3000)
})
ipcMain.on('electron-depatch', async () => {
    console.log('depatch')
    setTimeout(async () => {
        await UnPatcher.unpatch().then(async () => {
            console.log('Все хорошо')
            store.set('patched', false)
        })
    }, 3000)
})

ipcMain.on('electron-corsanywhereport', event => {
    event.returnValue = corsAnywherePort
})

ipcMain.on('autoStartMusic', async (event, value) => {
    store.set('autoStartMusic', value)
})

setInterval(() => {
    let metadata = getTrackInfo()
    if (Object.keys(metadata).length >= 1)
        mainWindow.webContents.send('trackinfo', metadata)
}, 5000)

ipcMain.handle('getVersion', async event => {
    const version = app.getVersion()
    if (version) return version
})
ipcMain.on('openPath', async (event, data) => {
    switch (data) {
        case 'appPath':
            const appPath = app.getAppPath()
            const pulseSyncPath = path.resolve(appPath, '../..')
            await shell.openPath(pulseSyncPath)
            break
        case 'musicPath':
            const musicDir = app.getPath('music')
            const downloadDir = path.join(musicDir, 'PulseSyncMusic')
            await shell.openPath(downloadDir)
            break
    }
})

ipcMain.on(
    'download-track',
    (event, val: { url: string; track: TrackInterface }) => {
        const musicDir = app.getPath('music')
        const downloadDir = path.join(musicDir, 'PulseSyncMusic')
        dialog
            .showSaveDialog(mainWindow, {
                title: 'Сохранить как',
                defaultPath: path.join(
                    downloadDir,
                    `${val.track.playerBarTitle} - ${val.track.artist}.mp3`,
                ),
                filters: [{ name: 'Трек', extensions: ['mp3'] }],
            })
            .then(result => {
                if (!result.canceled)
                    https.get(val.url, response => {
                        const totalFileSize = parseInt(
                            response.headers['content-length'],
                            10,
                        )
                        let downloadedBytes = 0

                        response.on('data', chunk => {
                            downloadedBytes += chunk.length
                            const percent = getPercent(
                                downloadedBytes,
                                totalFileSize,
                            )
                            mainWindow.setProgressBar(percent / 100)
                            mainWindow.webContents.send(
                                'download-track-progress',
                                percent,
                            )
                            console.log(percent)
                        })

                        response
                            .pipe(fs.createWriteStream(result.filePath))
                            .on('finish', () => {
                                mainWindow.webContents.send(
                                    'download-track-finished',
                                )

                                shell.showItemInFolder(result.filePath)
                                mainWindow.setProgressBar(-1)
                            })
                    })
                else mainWindow.webContents.send('download-track-cancelled')
            })
            .catch(() => mainWindow.webContents.send('download-track-failed'))
    },
)
ipcMain.on('get-music-device', event => {
    systeminformation.system().then(data => {
        event.returnValue = `os=${os.type()}; os_version=${os.version()}; manufacturer=${
            data.manufacturer
        }; model=${data.model}; clid=WindowsPhone; device_id=${
            data.uuid
        }; uuid=${v4({ random: Buffer.from(data.uuid) })}`
    })
})
