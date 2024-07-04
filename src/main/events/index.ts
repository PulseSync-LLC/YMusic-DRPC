import {app, BrowserWindow, dialog, ipcMain, shell} from "electron";
import logger from "../modules/logger";
import path from "path";
import TrackInterface from "../../renderer/api/interfaces/track.interface";
import https from "https";
import {getPercent} from "../../renderer/utils/percentage";
import fs from "fs";
import * as si from "systeminformation";
import os from "os";
import {v4} from "uuid";
import {corsAnywherePort, mainWindow} from "../../index";
import {getUpdater} from "../modules/updater/updater";
import checkAndTerminateYandexMusic from "../../../utils/processUtils";
import Patcher from "../modules/patcher/patch";
import {store} from "../modules/storage";
import UnPatcher from "../modules/patcher/unpatch";

export const handleEvents = (
    window: BrowserWindow
): void => {
    const updater = getUpdater()

    ipcMain.on('update-install', () => {
        updater.install()
    })

    ipcMain.on('electron-window-minimize', () => {
        mainWindow.minimize()
    })

    ipcMain.on('electron-exit', () => {
        logger.main.info("Exit app")
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
                store.set('patched', true)
            })
        }, 3000)
    })

    ipcMain.on('electron-repatch', async () => {
        await checkAndTerminateYandexMusic()
        setTimeout(async () => {
            await UnPatcher.unpatch().then(async () => {
                Patcher.patchRum().then(async () => store.set('patched', true))
            })
        }, 3000)
    })
    ipcMain.on('electron-depatch', async () => {
        await checkAndTerminateYandexMusic()
        setTimeout(async () => {
            await UnPatcher.unpatch().then(async () => {
                store.set('patched', false)
            })
        }, 3000)
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
                .catch(() => mainWindow.webContents.send('download-track-failed'))
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
    ipcMain.on('checkUpdate', async (event, data) => {
        logger.main.info('Updater: check update')
        await updater.check()
    })

}
export const handleAppEvents = (window: BrowserWindow): void => {
    handleEvents(window)
}

