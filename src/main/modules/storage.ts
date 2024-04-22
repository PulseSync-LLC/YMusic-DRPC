import Store from 'electron-store'
import { ipcMain } from 'electron'

export const store = new Store()

ipcMain.on('electron-store-get', (event, val) => {
    event.returnValue = store.get(val)
})

ipcMain.on('electron-store-set', (event, key, val) => {
    store.set(key, val)
})

ipcMain.on('electron-store-delete', (event, key) => {
    store.delete(key)
})

ipcMain.on('electron-store-has', (event, key) => {
    event.returnValue = store.has(key)
})
