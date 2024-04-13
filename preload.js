const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('drp', {
    clickMinimize: () => ipcRenderer.invoke('minimizeWin'),
    clickClose: () => ipcRenderer.invoke('closeWin'),
    clickPatcher: () => ipcRenderer.invoke('patcherWin'),
    pathAppOpen: () => ipcRenderer.invoke('pathAppOpen'),
    checkFileExists: () => ipcRenderer.invoke('checkFileExists'),
})
