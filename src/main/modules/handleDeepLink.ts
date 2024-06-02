import { app, BrowserWindow } from 'electron'
import { state } from './state'
import { store } from './storage'

let deeplinkUrl: string | null = null

const transformUrlToInternal = (url: string): string => {
    return url.replace(`pulsesync://`, '/')
}

export const checkIsDeeplink = (value: string): boolean => {
    const deeplinkRegexp = /pulsesync:\/\/.*/;
    return deeplinkRegexp.test(value)
}

export const navigateToDeeplink = (
    window: BrowserWindow,
    url: string | null,
): void => {
    if (!url) {
        return
    }
    // const pathname = transformUrlToInternal(url)

    //console.info('Navigate to', url, pathname)
    const regex = /^pulsesync:\/\/([^\/]+)\/?(.*)$/
    const match = url.match(regex)
    if(!match) return
    const mainPath = match[1]
    const argsPath = match[2]
    switch (mainPath) {
        case 'callback':
            const reg = url.match(/\?token=([^&]+)/)
            const token = decodeURIComponent(reg[1])
            store.set("token", token)
            window.webContents.send("authSuccess")
            break
        case "joinRoom":
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
    if (!app.isDefaultProtocolClient('pulsesync')) {
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
