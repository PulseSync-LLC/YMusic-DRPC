'use strict'
import * as semver from 'semver'
import { app } from 'electron'
import { autoUpdater, UpdateCheckResult } from 'electron-updater'
import { state } from '../state'
import { UpdateUrgency } from './constants/updateUrgency'
import { UpdateStatus } from './constants/updateStatus'
import log from 'electron-log'
import { UpdateInfo as ElectronUpdateInfo } from 'electron-updater'

interface UpdateInfo extends ElectronUpdateInfo {
    commonConfig?: UpdateInfo | null
    updateConfig?: {
        DEPRECATED_VERSIONS?: string
        UPDATE_URL?: string
        [key: string]: any // Позволяет добавлять дополнительные поля
    }
}
export class Updater {
    latestAvailableVersion: string | null = null
    updateStatus: UpdateStatus = UpdateStatus.IDLE
    updaterId: NodeJS.Timeout | null = null
    onUpdateListeners: Array<(version: string) => void> = []
    logger: log.LogFunctions = null
    commonConfig: UpdateInfo = {
        version: '',
        files: [],
        path: '', // deprecated
        sha512: '', // deprecated
        releaseName: null,
        releaseNotes: null,
        releaseDate: '',
        stagingPercentage: undefined,
        updateConfig: {
            DEPRECATED_VERSIONS: '',
            UPDATE_URL: '',
        },
    }
    constructor() {
        autoUpdater.logger = log
        autoUpdater.autoRunAppAfterInstall = true
        this.logger = log.scope('Updater')
        autoUpdater.on('error', error => {
            this.logger.error('Updater error', error)
        })
        autoUpdater.on('checking-for-update', () => {
            this.logger.log('Checking for update')
        })
        autoUpdater.on('update-downloaded', (updateInfo: UpdateInfo) => {
            this.logger.log('Update downloaded', updateInfo.version)
            if ('updateUrgency' in updateInfo) {
                if (updateInfo.updateUrgency === UpdateUrgency.HARD) {
                    this.logger.info('This update should be installed now')
                    this.install()
                    return
                }
            }
            if (this.commonConfig.updateConfig.DEPRECATED_VERSIONS) {
                const isDeprecatedVersion = semver.satisfies(
                    app.getVersion(),
                    this.commonConfig.updateConfig.DEPRECATED_VERSIONS,
                )
                if (isDeprecatedVersion) {
                    this.logger.info(
                        'This version is deprecated',
                        app.getVersion(),
                        this.commonConfig.updateConfig.DEPRECATED_VERSIONS,
                    )
                    this.install()
                    return
                }
            }
            this.latestAvailableVersion = updateInfo.version
            this.onUpdateListeners.forEach(listener => {
                listener(updateInfo.version)
            })
        })
    }

    updateApplier(updateResult: UpdateCheckResult) {
        try {
            const { downloadPromise, updateInfo } = updateResult
            if ('updateUrgency' in updateInfo) {
                this.logger.info('Urgency', updateInfo.updateUrgency)
            }
            const updateInfoTyped = updateInfo as UpdateInfo
            if ('commonConfig' in updateInfoTyped) {
                this.logger.info('Common config', updateInfoTyped.commonConfig)
                this.commonConfig = updateInfoTyped.commonConfig
                this.logger.info(this.commonConfig)
            }
            console.log(updateResult)
            if (!downloadPromise) {
                return
            }
            this.logger.info(
                'New version available',
                app.getVersion(),
                '->',
                updateInfo.version,
            )
            this.updateStatus = UpdateStatus.DOWNLOADING
            downloadPromise
                .then(downloadResult => {
                    if (downloadResult) {
                        console.log(downloadResult)
                        this.updateStatus = UpdateStatus.DOWNLOADED
                        this.logger.info(`Download result: ${downloadResult}`)
                    }
                })
                .catch(error => {
                    this.updateStatus = UpdateStatus.IDLE
                    this.logger.error('Downloader error', error)
                })
        } catch (error) {
            console.log('Updater error', error)
        }
    }

    async check() {
        if (this.updateStatus !== UpdateStatus.IDLE) {
            this.logger.log('New update is processing', this.updateStatus)
            return
        }
        try {
            const updateResult = await autoUpdater.checkForUpdates()
            if (!updateResult) {
                this.logger.log('No update found')
                return
            }
            this.updateApplier(updateResult)
        } catch (error) {
            this.logger.error('Update check error', error)
        }
    }

    start() {
        this.check()
        this.updaterId = setInterval(() => {
            this.check()
        }, 12000)
    }

    stop() {
        if (this.updaterId) {
            clearInterval(this.updaterId)
        }
    }

    onUpdate(listener: (version: string) => void) {
        this.onUpdateListeners.push(listener)
    }

    install() {
        this.logger.info(
            'Installing a new version',
            this.latestAvailableVersion,
        )
        state.willQuit = true
        autoUpdater.quitAndInstall()
    }
}
exports.Updater = Updater
export const getUpdater = (() => {
    let updater: Updater | undefined
    return () => {
        if (!updater) {
            updater = new Updater()
        }
        return updater
    }
})()
