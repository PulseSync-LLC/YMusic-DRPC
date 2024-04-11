const {
  contextBridge,
  ipcRenderer
} = require("electron");

contextBridge.exposeInMainWorld("drp", {
  clickMinimize: () => ipcRenderer.invoke("minimizeWin"),
  clickClose: () => ipcRenderer.invoke("closeWin"),
  clickPatcher: () => ipcRenderer.invoke("patcherWin"),
  checkFileExists: () => ipcRenderer.invoke("checkFileExists"),
  requestTrackInfo: () => ipcRenderer.invoke("requestTrackInfo"),
});