import { app, BrowserWindow, ipcMain, shell, session, protocol } from 'electron'
import process from 'process'
import { getNativeImg } from './main/utils'
import './main/modules/index'
import path from 'path'
import fs from 'fs'
import { store } from './main/modules/storage'
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
import { getTrackInfo, setTheme } from './main/modules/httpServer'
import { getUpdater } from './main/modules/updater/updater'
import { isDev } from './renderer/api/config'
import { handleAppEvents } from './main/events'
import checkAndTerminateYandexMusic from '../utils/processUtils'
import { exec } from 'child_process'
import Theme from './renderer/api/interfaces/theme.interface'
import logger from './main/modules/logger'
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

declare const PRELOADER_PRELOAD_WEBPACK_ENTRY: string
declare const PRELOADER_WEBPACK_ENTRY: string

const isMac = process.platform === 'darwin'
export let corsAnywherePort: string | number
export let mainWindow: BrowserWindow
let preloaderWindow: BrowserWindow
let availableThemes: Theme[] = [];
let selectedTheme: string;
const defaultTheme = {
    name: 'Default',
    image: 'url',
    author: 'Your Name',
    description: 'Default theme.',
    version: '1.0.0',
    css: 'style.css',
    script: 'script.js',
};

const defaultCssContent = `{}`;

const defaultScriptContent = ``;
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
            webSecurity: false,
        },
    })

    preloaderWindow.loadURL(PRELOADER_WEBPACK_ENTRY)
    preloaderWindow.once('ready-to-show', () => preloaderWindow.show())

    // Create the browser window.
    mainWindow = new BrowserWindow({
        show: false,
        frame: isMac,
        backgroundColor: '#16181E',
        width: 940,
        height: 720,
        minWidth: 940,
        minHeight: 720,
        transparent: false,
        icon,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            devTools: true,
            nodeIntegration: true,
            webSecurity: false,
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
    if (isDev) {
        mainWindow.webContents.openDevTools()
    }
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
        scheme: 'file',
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
    handleAppEvents(mainWindow)
    handleDeeplinkOnApplicationStartup()
    handleDeeplink(mainWindow)
    createTray()
    updater.start()
    updater.onUpdate(version => {
        mainWindow.webContents.send('update-available', version)
    })
})
function createDefaultThemeIfNotExists(themesFolderPath: string) {
    const defaultThemePath = path.join(themesFolderPath, defaultTheme.name);
    try {


        if (!fs.existsSync(defaultThemePath)) {
            fs.mkdirSync(defaultThemePath, { recursive: true });

            const metadataPath = path.join(defaultThemePath, 'metadata.json');
            const cssPath = path.join(defaultThemePath, defaultTheme.css);
            const scriptPath = path.join(defaultThemePath, defaultTheme.script);

            fs.writeFileSync(metadataPath, JSON.stringify(defaultTheme, null, 2), 'utf-8');
            fs.writeFileSync(cssPath, defaultCssContent, 'utf-8');
            fs.writeFileSync(scriptPath, defaultScriptContent, 'utf-8');

            logger.main.info(`Themes: default theme created at ${defaultThemePath}.`);
        }
    }
    catch (err) {
        logger.main.error('Theme: error creating default theme:', err);
    }
}
async function loadThemes(): Promise<Theme[]> {
    const themesFolderPath = path.join(app.getPath('appData'), 'PulseSync', 'themes');

    try {
        createDefaultThemeIfNotExists(themesFolderPath);
        const folders = await fs.promises.readdir(themesFolderPath);
        availableThemes = [];

        for (const folder of folders) {
            const themeFolderPath = path.join(themesFolderPath, folder);
            const metadataFilePath = path.join(themeFolderPath, 'metadata.json');

            if (fs.existsSync(metadataFilePath)) {
                try {
                    const data = await fs.promises.readFile(metadataFilePath, 'utf-8');
                    const metadata: Theme = JSON.parse(data);
                    metadata.path = themeFolderPath;
                    availableThemes.push(metadata);
                } catch (err) {
                    logger.main.error(`Themes: error reading or parsing metadata.json in theme ${folder}:`, err);
                }
            } else {
                logger.main.error(`Themes: metadata.json not found in theme ${folder}`);
            }
        }

        logger.main.info('Themes: Available themes:', availableThemes);
        return availableThemes;

    } catch (err) {
        console.error('Error reading themes directory:', err);
        throw err;
    }
}
ipcMain.handle('getThemes', async () => {
    try {
        const themes = await loadThemes();
        return themes;
    } catch (error) {
        logger.main.error('Themes: Error loading themes:', error);
        throw error;
    }
});

ipcMain.on('themeChanged', (event, themeName) => {
    logger.main.info(`Themes: theme changed to: ${themeName}`);
    selectedTheme = themeName;
    setTheme(selectedTheme);
});
function initializeTheme() {
    selectedTheme = store.get('theme') || 'Default';
    setTheme(selectedTheme);
}
app.whenReady().then(async () => {
    if (isDev) {
        await session.defaultSession.loadExtension(
            path.join(
                __dirname,
                '../',
                '../',
                'ReactDevTools',
                'fmkadmapgofadopljbjfkapdkoienihi',
                '5.2.0_0',
            ),
        )
    }
    initializeTheme();
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
    if (store.has('autoStartMusic') && store.get('autoStartMusic')) {
        let appPath = path.join(
            process.env.LOCALAPPDATA,
            'Programs',
            'YandexMusic',
            'Яндекс Музыка.exe',
        )
        appPath = `"${appPath}"`

        const command = `${appPath} --remote-allow-origins=*`
        await checkAndTerminateYandexMusic()
        exec(command, (error, stdout, stderr) => {
            if (error) {
                logger.main.error(`MusicAutoStart: Ошибка при выполнении команды: ${error}`)
                return
            }
        })
    }
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
setInterval(() => {
    let metadata = getTrackInfo()
    if (Object.keys(metadata).length >= 1) {
        mainWindow.webContents.send('trackinfo', metadata)
    }
}, 5000)
