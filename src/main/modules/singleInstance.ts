import { app, BrowserWindow, dialog } from 'electron'
import { checkIsDeeplink, navigateToDeeplink } from './handleDeepLink'
import logger from './logger'
import httpServer from './httpServer'
import config from '../../config.json'
import {prestartCheck} from "../../index";
const isFirstInstance = app.requestSingleInstanceLock()

export const checkForSingleInstance = (): void => {
    logger.main.info('Single instance')
    if (isFirstInstance) {
        const [window] = BrowserWindow.getAllWindows()
        app.on(
            'second-instance',
            (event: Electron.Event, commandLine: string[]) => {
                if (window) {
                    if (window.isMinimized()) {
                        window.restore()
                        logger.main.log('Restore window')
                    }
                    const lastCommandLineArg = commandLine.pop()
                    if (
                        lastCommandLineArg &&
                        checkIsDeeplink(lastCommandLineArg)
                    ) {
                        navigateToDeeplink(window, lastCommandLineArg)
                    }
                    toggleWindowVisibility(window, true)
                    logger.main.log('Show window')
                }
            },
        )
        prestartCheck()
        httpServer.listen(config.PORT, () => {
            console.log(`Server running at http://localhost:${config.PORT}/`)
        })
    } else {
        app.quit()
    }
}
const toggleWindowVisibility = (window: BrowserWindow, isVisible: boolean) => {
    if (isVisible) {
        window.show()
    } else {
        window.hide()
    }
}
