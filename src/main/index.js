const {
    app,
    shell,
    BrowserWindow,
    Tray,
    ipcMain,
    Menu,
    dialog, nativeImage,
} = require('electron')
const path = require('path')
const { exec } = require('child_process')
const url = require('url')
const fs = require('fs')
const { Client } = require('@xhayper/discord-rpc')
const getTrackInfo = require('../../RequestHandler')

let rpcConnected = false
let rpc = new Client({
    clientId: '984031241357647892',
    transport: {
        type: 'ipc',
    },
})

rpc.login().catch(e => {
    console.error('discord-rpc: Error while connecting: ' + e)
})
rpc.on('ready', () => {
    rpcConnected = true
    console.info('discordRpc state: connected')
})
rpc.on('disconnected', () => {
    rpcConnected = false
    console.info('discordRpc state: disconnected')
})

rpc.on('error', () => {
    rpcConnected = false
    console.info('discordRpc state: error')
})
rpc.on('close', () => {
    rpcConnected = false
    console.info('discordRpc state: closed')
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
const getNativeImg = (name, ext, useFor) =>
nativeImage.createFromPath(
    `${app.isPackaged ? process.resourcesPath + '/app.asar/.webpack/renderer/' : ''}main_window/static/assets/${
        useFor ? useFor + '/' : ''
    }${name}${ext}`,
)
const icon = getNativeImg('logoapp', '.ico', 'icon').resize({
    width: 40,
    height: 40,
})
function createWindow() {
    let win = new BrowserWindow({
        width: 615,
        height: 900,
        minWidth: 615,
        minHeight: 577,
        maxWidth: 615,
        icon,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, '../renderer/main_window/preload.js'),
        },
    })

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, '../renderer/main_window/index.html'),
            protocol: 'file:',
            slashes: true,
        }),
    )
    win.once('ready-to-show', () => {
        win.show()
        win.moveTop()
    })
    win.webContents.setWindowOpenHandler(edata => {
        shell.openExternal(edata.url)
        return { action: 'deny' }
    })

    // win.webContents.openDevTools();

    tray = new Tray(icon)
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

    ipcMain.handle('patcherWin', event => {
        require('../../Patcher')
    })

    ipcMain.handle('unpatcherWin', async event => {
        require('../../PatcherBack')
    })

    ipcMain.handle('pathAppOpen', async () => {
        const appPath = app.getAppPath()
        const pulseSyncPath = path.resolve(appPath, '../..')
        await shell.openPath(pulseSyncPath)
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

    ipcMain.handle('checkSelectedStyle', () => {
        let confData = fs.readFileSync(confFilePath, 'utf8')
        let themeDir = JSON.parse(confData).select

        let fileCheck = path.join(themesDir, themeDir, 'metadata.json')
        let jsonData = fs.readFileSync(fileCheck, 'utf8')
        let theme = JSON.parse(jsonData)
        theme.path = path.join(themesDir, themeDir, '\\')
        console.log(theme)
        return theme
    })

    ipcMain.handle('getThemesList', () => {
        let confData = fs.readFileSync(confFilePath, 'utf8')
        let conf = JSON.parse(confData)
        let folders = []

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
                const metadata = JSON.parse(
                    fs.readFileSync(metadataPath, 'utf8'),
                )
                metadata.path = metadataPath
                folders.push(metadata)
            }
        })

        const themeDirs = fs.readdirSync(themesDir)
        themeDirs.forEach(themeDir => {
            const metadataPath = path.join(themesDir, themeDir, 'metadata.json')
            if (fs.existsSync(metadataPath)) {
                const metadata = JSON.parse(
                    fs.readFileSync(metadataPath, 'utf8'),
                )
                metadata.path = path.join(themesDir, themeDir, '/')
                folders.push(metadata)
            }
        })

        return folders
    })

    ipcMain.handle('selectStyle', async (event, name, author) => {
        try {
            const themesDir = path.join(
                process.env.LOCALAPPDATA,
                'YDRPC Modification',
                'themes',
            )
            const themeDirs = fs.readdirSync(themesDir)

            let selectedStyle = ''

            for (const themeDir of themeDirs) {
                const metadataPath = path.join(
                    themesDir,
                    themeDir,
                    'metadata.json',
                )
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

    const updateDiscordRPC = data => {
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
        if (linkTitle) {
            rpc.user.setActivity({
                state: timeRange,
                details: details,
                largeImageKey: largeImage,
                smallImageKey: smallImage,
                smallImageText: 'Yandex Music',
                buttons: [
                    {
                        label: '✌️ Open in YandexMusic',
                        url: `yandexmusic://album/${encodeURIComponent(linkTitle)}`,
                    },
                    {
                        label: '🤠 PulseSync Project',
                        url: `https://github.com/PulseSync-LLC/YMusic-DRPC`,
                    },
                ],
            })
        } else {
            rpc.user.setActivity({
                state: timeRange,
                details: details,
                largeImageKey: largeImage,
                smallImageKey: smallImage,
                smallImageText: 'Yandex Music',
                buttons: [
                    {
                        label: '🤠 PulseSync Project',
                        url: `https://github.com/PulseSync-LLC/YMusic-DRPC`,
                    },
                ],
            })
        }
    }

    const noYMAppDiscordRPC = () => {
        rpc.user.setActivity({
            details: 'AFK',
            largeImageText: 'YM MINI',
            largeImageKey: 'ym',
        })
    }

    setInterval(() => {
        if (!rpcConnected) {
            rpc = new Client({
                clientId: '984031241357647892',
                transport: {
                    type: 'ipc',
                },
            })
            rpc.login().catch(e => {
                console.error('discord-rpc error: ' + e)
            })
        } else {
            if (metadata && Object.keys(metadata).length) {
                updateDiscordRPC(metadata)
            } else {
                noYMAppDiscordRPC()
            }
        }
    }, 5000)
}
app.on('ready', async () => {
    createWindow()
})