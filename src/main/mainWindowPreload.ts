import { contextBridge, ipcRenderer } from 'electron'
import { SetActivity } from '@xhayper/discord-rpc/dist/structures/ClientUser'

contextBridge.exposeInMainWorld('drp', {
    clickMinimize: () => ipcRenderer.invoke('minimizeWin'),
    clickClose: () => ipcRenderer.invoke('closeWin'),
    clickPatcher: () => ipcRenderer.invoke('patcherWin'),
    clickUnpatcher: () => ipcRenderer.invoke('unpatcherWin'),
    pathAppOpen: () => ipcRenderer.invoke('pathAppOpen'),
    pathStyleOpen: () => ipcRenderer.invoke('pathStyleOpen'),
    checkSelectedStyle: () => ipcRenderer.invoke('checkSelectedStyle'),
    selectStyle: (name: any, author: any) =>
        ipcRenderer.invoke('selectStyle', name, author),
    getThemesList: () => ipcRenderer.invoke('getThemesList'),
    checkFileExists: () => ipcRenderer.invoke('checkFileExists'),
})
contextBridge.exposeInMainWorld('discordRPC', {
    async setActivity(presence: SetActivity) {
        ipcRenderer.send('discordrpc-setstate', presence)
    },
    async clearActivity() {
        ipcRenderer.send('discordrpc-clearstate')
    },
})
