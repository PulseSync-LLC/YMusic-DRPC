import { app, BrowserWindow } from 'electron'
import { state } from './state'
import { store } from './storage'
import config from "../../renderer/api/config";
import path from "path";
import isAppDev from 'electron-is-dev'

let deeplinkUrl: string | null = null

const transformUrlToInternal = (url: string): string => {
    return url.replace(`pulsesync://`, '/')
}

export const checkIsDeeplink = (value: string): boolean => {
    const deeplinkRegexp = /pulsesync:\/\/.*/
    return deeplinkRegexp.test(value)
}

export const navigateToDeeplink = (
    window: BrowserWindow,
    url: string | null,
): void => {
    if (!url) {
        return
    }

    const regex = /^pulsesync:\/\/([^\/]+)\/?(.*)$/
    const match = url.match(regex)
    if (!match) return
    const mainPath = match[1]
    switch (mainPath) {
        case 'callback':
            const reg = url.match(/\?token=([^&]+)&id=([^&]+)/)
            const token = decodeURIComponent(reg[1])
            const id = decodeURIComponent(reg[2]);
            fetch(`${config.SERVER_URL}/api/v1/user/${id}/access`).then(async (res) => {
                const j = await res.json()
                if (j.ok) {
                    if (!j.access) {
                      return app.quit()
                    }
                }
                else {
                    return app.quit()
                }
            }).catch(() => {
                return app.quit()
            })
            store.set('tokens.token', token)
            window.webContents.send('authSuccess')
            break
        case 'ban':
            const regex = url.match(/\?reason=([^&]+)/)
            const reason = decodeURIComponent(regex[1])
            window.webContents.send('authBanned', {reason: reason})
            break
        case 'joinRoom':
            break
    }
    window.focus()
    state.deeplink = null
}

export const handleDeeplinkOnApplicationStartup = (): void => {
    const lastArgFromProcessArgs = process.argv.pop()
    if (lastArgFromProcessArgs && checkIsDeeplink(lastArgFromProcessArgs)) {
        state.deeplink = lastArgFromProcessArgs
    }
    console.log(process.execPath)
    console.log(lastArgFromProcessArgs)
    if (isAppDev) {
        app.setAsDefaultProtocolClient('pulsesync', process.execPath)
    } else {
        app.setAsDefaultProtocolClient('pulsesync')
    }
    app.on('open-url', (event, url) => {
        event.preventDefault()
        state.deeplink = url
        console.info('Open on startup', url)
    })
}

export const handleDeeplink = (window: BrowserWindow): void => {
    app.on('open-url', (event, url) => {
        event.preventDefault()
        navigateToDeeplink(window, url)
    })
    navigateToDeeplink(window, deeplinkUrl)
}
