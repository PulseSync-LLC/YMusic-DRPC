import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { SetActivity } from '@xhayper/discord-rpc/dist/structures/ClientUser'

contextBridge.exposeInMainWorld('electron', {
    store: {
        get(key: string) {
            return ipcRenderer.sendSync('electron-store-get', key)
        },
        has(key: string): boolean {
            return ipcRenderer.sendSync('electron-store-has', key)
        },
        set(property: string, val: any) {
            ipcRenderer.send('electron-store-set', property, val)
        },
        delete(property: string) {
            ipcRenderer.send('electron-store-delete', property)
        },
    },
    window: {
        minimize() {
            ipcRenderer.send('electron-window-minimize')
        },
        maximize() {
            ipcRenderer.send('electron-window-maximize')
        },
        close() {
            ipcRenderer.send('electron-window-close')
        },
        isMac() {
            return ipcRenderer.sendSync('electron-mac')
        },
    },
    patcher: {
        patch: (val: boolean) => ipcRenderer.send('electron-patch', val),
        repatch: () => ipcRenderer.send('electron-repatch'),
        depatch: () => ipcRenderer.send('electron-depatch'),
    },
    autoStartMusic: (val: boolean) => ipcRenderer.send('autoStartMusic', val),
    clickMinimize: () => ipcRenderer.send('minimizeWin'),
    clickClose: () => ipcRenderer.send('closeWin'),
    clickPatcher: () => ipcRenderer.send('patcherWin'),
    clickUnpatcher: () => ipcRenderer.send('unpatcherWin'),
    pathAppOpen: () => ipcRenderer.send('pathAppOpen'),
    pathStyleOpen: () => ipcRenderer.send('pathStyleOpen'),
    checkSelectedStyle: () => ipcRenderer.send('checkSelectedStyle'),
    selectStyle: (name: any, author: any) =>
        ipcRenderer.send('selectStyle', name, author),
    getThemesList: () => ipcRenderer.send('getThemesList'),
    checkFileExists: () => ipcRenderer.send('checkFileExists'),
})

contextBridge.exposeInMainWorld('discordRpc', {
    async setActivity(presence: SetActivity) {
        ipcRenderer.send('discordrpc-setstate', presence)
    },
    async clearActivity() {
        ipcRenderer.send('discordrpc-clearstate')
    },
    async enableRpc(val: boolean) {
        ipcRenderer.send('discordrpc-enablerpc', val)
    },
    async enableListenButton(val: boolean) {
        ipcRenderer.send('discordrpc-enablerpcbuttonlisten', val)
    },
})
