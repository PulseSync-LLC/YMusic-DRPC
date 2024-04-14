const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('drp', {
    clickMinimize: () => ipcRenderer.invoke('minimizeWin'),
    clickClose: () => ipcRenderer.invoke('closeWin'),
    clickPatcher: () => ipcRenderer.invoke('patcherWin'),
    pathAppOpen: () => ipcRenderer.invoke('pathAppOpen'),
    pathStyleOpen: () => ipcRenderer.invoke('pathStyleOpen'),
    selectStyle: (name, author) =>
        ipcRenderer.invoke('selectStyle', name, author),
    getThemesList: () => ipcRenderer.invoke('getThemesList'),
    checkFileExists: () => ipcRenderer.invoke('checkFileExists'),
})
