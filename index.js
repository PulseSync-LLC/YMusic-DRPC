const { app, shell, BrowserWindow, Tray, ipcMain, Menu } = require('electron')
const path = require('path')
const { exec } = require('child_process')
const url = require('url')
const fs = require('fs')
const RPC = require('discord-rpc')
const getTrackInfo = require('./RequestHandler')

const rpc = new RPC.Client({
    transport: 'ipc',
})

rpc.login({
    clientId: '984031241357647892',
})

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

let metadata
let tray = null

function createWindow() {
    let win = new BrowserWindow({
        width: 615,
        height: 900,
        minWidth: 615,
        minHeight: 577,
        maxWidth: 615,
        icon: path.join(__dirname, 'src', 'assets', 'appicon.png'),
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    })

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, 'src/index.html'),
            protocol: 'file:',
            slashes: true,
        }),
    )

    win.webContents.setWindowOpenHandler(edata => {
        shell.openExternal(edata.url)
        return { action: 'deny' }
    })

    // win.webContents.openDevTools();

    tray = new Tray(path.join(__dirname, 'src', 'assets', 'appicon.png'))
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click: () => win.show() },
        { label: 'Quit', click: () => app.quit() },
    ])
    tray.setToolTip('YMusic DRPC')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
        win.show()
    })

    ipcMain.handle('minimizeWin', () => {
        win.minimize()
    })

    ipcMain.handle('closeWin', () => {
        win.hide()
    })

    ipcMain.handle('patcherWin', () => {
        require('./Patcher')
    })

    ipcMain.handle('pathAppOpen', async () => {
        await shell.openPath(path.join(__dirname))
    })

    ipcMain.handle('checkFileExists', async () => {
        const fileExists = fs.existsSync(
            process.env.LOCALAPPDATA +
                '\\Programs\\YandexMusic\\resources\\patched.txt',
        )
        console.log(fileExists)
        return fileExists
    })

    ipcMain.handle('pathStyleOpen', async () => {
        const folderPath =
            process.env.LOCALAPPDATA + '\\YDRPC Modification\\themes'

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

    ipcMain.handle('getThemesList', () => {
        let folders = fs
            .readdirSync(themesDir, { withFileTypes: true })
            .filter(item => {
                return (
                    item.isDirectory() &&
                    fs.existsSync(
                        path.join(themesDir, item.name, 'metadata.json'),
                    )
                )
            })
            .map(item => item.name)

        if (!folders.includes('Default')) {
            folders.unshift('Default')
        }

        return folders
    })

    ipcMain.handle('selectStyle', (event, selectedStyle) => {
        try {
            let confData = fs.readFileSync(confFilePath, 'utf8')
            let conf = JSON.parse(confData)

            const stylePath = path.join(themesDir, selectedStyle)
            const metadataPath = path.join(stylePath, 'metadata.json')
            if (!fs.existsSync(metadataPath)) {
                selectedStyle = 'Default'
                conf.select = selectedStyle
                fs.writeFileSync(confFilePath, JSON.stringify(conf, null, 4))
            } else {
                conf.select = selectedStyle
                fs.writeFileSync(confFilePath, JSON.stringify(conf, null, 4))
            }

            return true
        } catch (error) {
            console.error('Ошибка при выборе стиля:', error)
            return false
        }
    })

    setInterval(() => {
        metadata = getTrackInfo()
    }, 1000)

    const updateDiscordRPC = (RPC, data) => {
        const {
            playerBarTitle,
            artist,
            timecodes,
            requestImgTrack,
            linkTitle,
        } = data
        const timeRange =
            timecodes.length === 2 ? `${timecodes[0]} - ${timecodes[1]}` : ''
        const details = artist
            ? `${playerBarTitle} - ${artist}`
            : playerBarTitle
        const largeImage = requestImgTrack[1] || 'ym'
        const smallImage = requestImgTrack[1] ? 'ym' : 'unset'
        const buttons = linkTitle
            ? [
                  {
                      label: '✌️ Open in YandexMusic',
                      url: `yandexmusic://album/${encodeURIComponent(linkTitle)}`,
                  },
              ]
            : null

        RPC.setActivity({
            state: timeRange,
            details: details,
            largeImageKey: largeImage,
            smallImageKey: smallImage,
            smallImageText: 'Yandex Music',
            buttons: buttons,
        })
    }

    const noYMAppDiscordRPC = RPC => {
        RPC.setActivity({
            details: 'AFK',
            largeImageText: 'YM MINI',
            largeImageKey: 'ym',
        })
    }

    setInterval(() => {
        // console.log(metadata)
        if (metadata && Object.keys(metadata).length) {
            updateDiscordRPC(rpc, metadata)
        } else {
            noYMAppDiscordRPC(rpc)
        }
    }, 1000)
}

app.on('ready', createWindow)
