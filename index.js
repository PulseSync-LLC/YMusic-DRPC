const { app, shell, BrowserWindow, Tray, ipcMain, Menu, dialog } = require('electron')
const path = require('path')
const { exec } = require('child_process')
const url = require('url')
const fs = require('fs')
const RPC = require('discord-rpc')
const getTrackInfo = require('./RequestHandler')

let rpcConnected = false;
const rpc = new RPC.Client({
    transport: 'ipc',
})

rpc.login({
    clientId: '984031241357647892',
}).catch((e) => {
    console.error("discord-rpc: Ошибка при подключении: " + e)
})
rpc.on('connected', () => {
    console.log('discord-rpc: connected')
    rpcConnected = true
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

    ipcMain.handle('patcherWin', (event) => {
        require('./Patcher')
        return
    })

    ipcMain.handle('unpatcherWin', async(event) => {
        require('./PatcherBack')
        return
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

    ipcMain.handle('checkSelectedStyle', () => {
        let confData = fs.readFileSync(confFilePath, 'utf8')
        let themeDir = JSON.parse(confData).select

        let fileCheck = path.join(themesDir, themeDir, 'metadata.json')
        let jsonData = fs.readFileSync(fileCheck, 'utf8')
        let theme = JSON.parse(jsonData)
        theme.path = path.join(themesDir, themeDir, "\\")
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
        if(linkTitle) {
            RPC.setActivity({
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
        }
        else {
            RPC.setActivity({
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

    const noYMAppDiscordRPC = RPC => {
        RPC.setActivity({
            details: 'AFK',
            largeImageText: 'YM MINI',
            largeImageKey: 'ym',
        })
    }

   setInterval(() => {
        if(!rpcConnected) return;
        if (metadata && Object.keys(metadata).length) {
            updateDiscordRPC(rpc, metadata)
        } else {
            noYMAppDiscordRPC(rpc)
        }
    }, 5000)

    ipcMain.handle("checkIfPackageInstalled", async() => {
        return await isGlobalPackageInstalled("asar")
            .then(installed => {
                if (installed) {
                    console.log(`You can use the package asar globally.`);
                    return true

                } else {
                    console.log(`Package asar is not found. Install it globally using npm install -g asar.`);
                    showMessageBox(`Пакет asar не установлен. Пропиши npm i asar -g`);
                    return false
                }
            })
            .catch(error => {
                console.error(`An error occurred: ${error}`);
            })
    })

}
app.on('ready', async () => {
    createWindow()
})
function isGlobalPackageInstalled(packageName) {
    return new Promise((resolve, reject) => {
        exec('npm list -g --depth=0', (error, stdout, stderr) => {
            if (error) {
                console.error(`An error occurred while checking the package ${packageName}:`, stderr);
                reject(stderr);
            } else {
                if (stdout.includes(packageName)) {
                    console.log(`Package ${packageName} is installed globally.`);
                    resolve(true);
                } else {
                    console.log(`Package ${packageName} is not installed globally.`);
                    resolve(false);
                }
            }
        });

    });
}
function showMessageBox(message) {
    dialog.showMessageBox({
        type: 'info',
        buttons: ['OK'],
        title: 'Package Check',
        message: message
    });
}
