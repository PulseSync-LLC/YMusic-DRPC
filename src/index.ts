import { app, BrowserWindow, ipcMain, Menu, Tray, shell } from 'electron'
import process from 'process'
import { getNativeImg } from './main/utils'
import './main/modules/index'
import path from 'path'
import fs from 'fs'
import { getTrackInfo } from './main/modules/httpServer'
import { store } from './main/modules/storage'
import Patcher from './main/modules/patcher/patch'
import UnPatcher from './main/modules/patcher/unpatch'
import createTray from './main/modules/tray'
import {exec} from "child_process";
import rpc_connect from "./main/modules/discordRpc";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
const isMac = process.platform === 'darwin'
export let mainWindow: BrowserWindow

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit()
}

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

let metadata
let tray = null
const createWindow = (): void => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        show: false,
        frame: isMac,
        backgroundColor: '#08070d',
        width: 1000,
        height: 577,
        minWidth: 1000,
        minHeight: 577,
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
        mainWindow.show()
        mainWindow.moveTop()
    })
    mainWindow.webContents.setWindowOpenHandler(electronData => {
        shell.openExternal(electronData.url)
        return { action: 'deny' }
    })
}

app.on('ready', () => {
    createWindow()
    createTray()
    prestartCheck()
})

function prestartCheck() {
    if(store.has("autoStartMusic") && store.get("autoStartMusic")) {

        let appPath = path.join(process.env.LOCALAPPDATA, 'Programs', 'YandexMusic', 'Яндекс Музыка.exe');
        appPath = `"${appPath}"`;

        const command = `${appPath} --remote-allow-origins=*`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Ошибка при выполнении команды: ${error}`);
                return;
            }
        });

    }
    if(store.has("discordRpc") && store.get("discordRpc")) {
        rpc_connect()
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

ipcMain.on('electron-patch', () => {
    console.log('patch')
    Patcher.patchRum()
})

ipcMain.on('electron-repatch', async () => {
    console.log('repatch')
    await UnPatcher.unpatch().then(() => {
        Patcher.patchRum()
    })
})
ipcMain.on('electron-depatch', async () => {
    console.log('depatch')
    await UnPatcher.unpatch().then(() => {
        console.log('Все хорошо')
    })
})

ipcMain.on('pathAppOpen', async () => {
    await shell.openPath(path.join(__dirname))
})

ipcMain.on('checkFileExists', async () => {
    const fileExists = fs.existsSync(
        process.env.LOCALAPPDATA +
            '\\Programs\\YandexMusic\\resources\\patched.txt',
    )
    console.log(fileExists)
    return fileExists
})

ipcMain.on('pathStyleOpen', async () => {
    const folderPath = process.env.LOCALAPPDATA + '\\YDRPC Modification\\themes'

    const fileExists = fs.existsSync(folderPath)

    if (fileExists) {
        await shell.openPath(folderPath)
        console.log('Folder opened:', folderPath)
        return true
    } else {
        console.log('Folder does not exist:', folderPath)
        return false
    }
})

ipcMain.on('checkSelectedStyle', () => {
    let confData = fs.readFileSync(confFilePath, 'utf8')
    let themeDir = JSON.parse(confData).select

    let fileCheck = path.join(themesDir, themeDir, 'metadata.json')
    let jsonData = fs.readFileSync(fileCheck, 'utf8')
    let theme = JSON.parse(jsonData)
    theme.path = path.join(themesDir, themeDir, '\\')
    console.log(theme)
    return theme
})

ipcMain.on('getThemesList', () => {
    let confData = fs.readFileSync(confFilePath, 'utf8')
    let conf = JSON.parse(confData)
    let folders: any[] = []

    // folders.push({
    //     name: 'Default',
    //     image: 'url',
    //     author: 'Your Name',
    //     description: 'Default theme.',
    //     version: '1.0.0',
    //     css: 'style.css',
    //     path: 'local',
    // })

    const themeFiles = fs.readdirSync(themesDir)
    themeFiles.forEach(themeFile => {
        const metadataPath = path.join(themesDir, themeFile)
        if (
            fs.statSync(metadataPath).isFile() &&
            themeFile.endsWith('metadata.json')
        ) {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
            metadata.path = metadataPath
            folders.push(metadata)
        }
    })

    const themeDirs = fs.readdirSync(themesDir)
    themeDirs.forEach(themeDir => {
        const metadataPath = path.join(themesDir, themeDir, 'metadata.json')
        if (fs.existsSync(metadataPath)) {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
            metadata.path = path.join(themesDir, themeDir, '/')
            folders.push(metadata)
        }
    })

    return folders
})

ipcMain.on('selectStyle', async (event, name, author) => {
    try {
        const themesDir = path.join(
            process.env.LOCALAPPDATA,
            'YDRPC Modification',
            'themes',
        )
        const themeDirs = fs.readdirSync(themesDir)

        let selectedStyle = ''

        for (const themeDir of themeDirs) {
            const metadataPath = path.join(themesDir, themeDir, 'metadata.json')
            if (fs.existsSync(metadataPath)) {
                const metadata = JSON.parse(
                    fs.readFileSync(metadataPath, 'utf8'),
                )
                if (metadata.name === name && metadata.author === author) {
                    selectedStyle = themeDir
                    break
                }
            }
        }

        if (!selectedStyle) {
            throw new Error(
                `Не удалось найти тему с названием "${name}" и автором "${author}".`,
            )
        }

        let confData = fs.readFileSync(confFilePath, 'utf8')
        let conf = JSON.parse(confData)
        conf.select = selectedStyle
        fs.writeFileSync(confFilePath, JSON.stringify(conf, null, 4))

        return true
    } catch (error) {
        console.error('Ошибка при выборе стиля:', error)
        return false
    }
})

setInterval(() => {
    metadata = getTrackInfo()
}, 1000)

ipcMain.on('autoStartMusic', async (event, value) => {
    store.set('autoStartMusic', value)
})
// const updateDiscordRPC = (RPC, data) => {
//     const { playerBarTitle, artist, timecodes, requestImgTrack, linkTitle } =
//         data
//     const timeRange =
//         timecodes.length === 2 ? `${timecodes[0]} - ${timecodes[1]}` : ''
//     const details = artist ? `${playerBarTitle} - ${artist}` : playerBarTitle
//     const largeImage = requestImgTrack[1] || 'ym'
//     const smallImage = requestImgTrack[1] ? 'ym' : 'unset'
//     const buttons = linkTitle
//         ? [
//               {
//                   label: '✌️ Open in YandexMusic',
//                   url: `yandexmusic://album/${encodeURIComponent(linkTitle)}`,
//               },
//           ]
//         : null
//
//     RPC.setActivity({
//         state: timeRange,
//         details: details,
//         largeImageKey: largeImage,
//         smallImageKey: smallImage,
//         smallImageText: 'Yandex Music',
//         buttons: buttons,
//     })
// }
//
// const noYMAppDiscordRPC = RPC => {
//     RPC.setActivity({
//         details: 'AFK',
//         largeImageText: 'YM MINI',
//         largeImageKey: 'ym',
//     })
// }

// setInterval(() => {
//     // console.log(metadata)
//     if (metadata && Object.keys(metadata).length) {
//         updateDiscordRPC(rpc, metadata)
//     } else {
//         noYMAppDiscordRPC(rpc)
//     }
// }, 1000)
