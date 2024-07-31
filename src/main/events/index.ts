import {
    app,
    BrowserWindow,
    dialog,
    ipcMain,
    shell,
    Notification,
} from 'electron'
import logger from '../modules/logger'
import path from 'path'
import TrackInterface from '../../renderer/api/interfaces/track.interface'
import https from 'https'
import { getPercent } from '../../renderer/utils/percentage'
import fs from 'fs'
import * as si from 'systeminformation'
import os from 'os'
import { v4 } from 'uuid'
import { corsAnywherePort, mainWindow } from '../../index'
import { getUpdater } from '../modules/updater/updater'
import checkAndTerminateYandexMusic, {
    checkAndStartYandexMusic,
} from '../../../utils/processUtils'
import Patcher from '../modules/patcher/patch'
import { store } from '../modules/storage'
import UnPatcher from '../modules/patcher/unpatch'
import { UpdateStatus } from '../modules/updater/constants/updateStatus'
import { updateAppId } from '../modules/discordRpc'
const updater = getUpdater()
export const handleEvents = (window: BrowserWindow): void => {
    ipcMain.on('update-install', () => {
        updater.install()
    })

    ipcMain.on('electron-window-minimize', () => {
        mainWindow.minimize()
    })

    ipcMain.on('electron-exit', () => {
        logger.main.info('Exit app')
        app.quit()
    })

    ipcMain.on('electron-window-maximize', () => {
        if (mainWindow.isMaximized()) mainWindow.unmaximize()
        else mainWindow.maximize()
    })

    ipcMain.on('electron-window-close', () => {
        mainWindow.hide()
    })

    ipcMain.on('electron-patch', async () => {
        await checkAndTerminateYandexMusic()
        setTimeout(async () => {
            await Patcher.patchRum().then(async () => {
                console.log('Все гуд')
                store.set('settings.patched', true)
                mainWindow.webContents.send('UPDATE_APP_DATA', {
                    patch: true,
                })
                await checkAndStartYandexMusic()
            })
        }, 2000)
    })

    ipcMain.on('electron-repatch', async () => {
        await checkAndTerminateYandexMusic()
        setTimeout(async () => {
            await UnPatcher.unpatch()
            setTimeout(async () => {
                Patcher.patchRum().then(async () => {
                    store.set('settings.patched', true)
                    mainWindow.webContents.send('UPDATE_APP_DATA', {
                        repatch: true,
                    })
                    await checkAndStartYandexMusic()
                })
            }, 3000)
        }, 2000)
    })
    ipcMain.on('electron-depatch', async () => {
        await checkAndTerminateYandexMusic()
        setTimeout(async () => {
            await UnPatcher.unpatch().then(async () => {
                store.set('settings.patched', false)
                mainWindow.webContents.send('UPDATE_APP_DATA', {
                    depatch: true,
                })
                await checkAndStartYandexMusic()
            })
        }, 2000)
    })

    ipcMain.on('electron-corsanywhereport', event => {
        event.returnValue = corsAnywherePort
    })
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
            case 'themePath':
                const themesFolderPath = path.join(
                    app.getPath('appData'),
                    'PulseSync',
                    'themes',
                )
                await shell.openPath(themesFolderPath)
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
                        `${val.track.playerBarTitle.replace(new RegExp('[?"/\\\\*:\\|<>]', 'g'), '')} - ${val.track.artist.replace(new RegExp('[?"/\\\\*:\\|<>]', 'g'), '')}.mp3`,
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
                .catch(() =>
                    mainWindow.webContents.send('download-track-failed'),
                )
        },
    )
    ipcMain.on('get-music-device', event => {
        si.system().then(data => {
            event.returnValue = `os=${os.type()}; os_version=${os.version()}; manufacturer=${
                data.manufacturer
            }; model=${data.model}; clid=WindowsPhone; device_id=${
                data.uuid
            }; uuid=${v4({ random: Buffer.from(data.uuid) })}`
        })
    })
    ipcMain.on('autoStartApp', async (event, data) => {
        app.setLoginItemSettings({
            openAtLogin: data,
            path: app.getPath('exe'),
        })
    })
    ipcMain.on('checkUpdate', async () => await checkOrFindUpdate())
    ipcMain.on('updater-start', async (event, data) => {
        await checkOrFindUpdate()
        updater.start()
        updater.onUpdate(version => {
            mainWindow.webContents.send('update-available', version)
        })
    })
    ipcMain.on('update-rpcSettings', async (event, data) => {
        console.log(data)
        switch (Object.keys(data)[0]) {
            case 'appId':
                console.log(data.appId)
                updateAppId(data.appId)
                break
            case 'details':
                store.set('discordRpc.details', data.details)
                break
            case 'state':
                store.set('discordRpc.state', data.state)
                break
            case 'button':
                store.set('discordRpc.button', data.button)
                break
        }
    })
    ipcMain.on('show-notification', async (event, data) => {
        return new Notification({ title: data.title, body: data.body }).show()
    })
    ipcMain.on('send-crashreport', async (event, data) => {
        // TODO: add c++ module for crash reporter
    })
}
export const handleAppEvents = (window: BrowserWindow): void => {
    handleEvents(window)
}
export const checkOrFindUpdate = async () => {
    logger.updater.info('Check update')
    const checkUpdate = await updater.check()
    if (checkUpdate === UpdateStatus.DOWNLOADING) {
        mainWindow.webContents.send('check-update', {
            updateAvailable: true,
        })
    } else if (checkUpdate === UpdateStatus.DOWNLOADED) {
        mainWindow.webContents.send('check-update', {
            updateAvailable: true,
        })
        mainWindow.webContents.send('download-update-finished')
    }
}
