import { app, BrowserWindow, dialog } from 'electron'
import { checkIsDeeplink, navigateToDeeplink } from './handleDeepLink';
import logger from './logger';
import httpServer from './httpServer'
import config from '../../config.json'
import { store } from './storage'
import path from 'path'
import { exec } from 'child_process'
const isFirstInstance = app.requestSingleInstanceLock();

export const checkForSingleInstance = (): void => {
    logger.main.info('Single instance');
    if (isFirstInstance) {
        const [window] = BrowserWindow.getAllWindows();
        app.on('second-instance', (event: Electron.Event, commandLine: string[]) => {
            if (window) {
                if (window.isMinimized()) {
                    window.restore();
                    logger.main.log('Restore window');
                }
                const lastCommandLineArg = commandLine.pop();
                if (lastCommandLineArg && checkIsDeeplink(lastCommandLineArg)) {
                    navigateToDeeplink(window, lastCommandLineArg);
                }
                toggleWindowVisibility(window, true);
                logger.main.log('Show window');
            }
        });
        httpServer.listen(config.PORT, () => {
            console.log(`Server running at http://localhost:${config.PORT}/`)
        })
        if (store.has('autoStartMusic') && store.get('autoStartMusic')) {
            let appPath = path.join(
                process.env.LOCALAPPDATA,
                'Programs',
                'YandexMusic',
                'Яндекс Музыка.exe',
            )
            appPath = `"${appPath}"`

            const command = `${appPath}`

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Ошибка при выполнении команды: ${error}`)
                    return
                }
            })
        }
    } else {
        app.quit();
    }
};
const toggleWindowVisibility = (window: BrowserWindow, isVisible: boolean) => {
    if (isVisible) {
        window.show();
    }
    else {
        window.hide();
    }
};
