const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const url = require('url');
const fs = require('fs');
const RPC = require("discord-rpc")
const getTrackInfo = require('./RequestHandler');

const rpc = new RPC.Client({
  transport: "ipc"
})

rpc.on('ready', () => {
  rpc.setActivity({
    details: 'AFK',
    largeImageText: 'YM MINI',
    largeImageKey: 'ym',
  })
  console.log("RPC good")
})

rpc.login({
  clientId: "984031241357647892",
})

let metadata;

function createWindow() {
  let win = new BrowserWindow({
    width: 815,
    height: 600,
    minWidth: 815,
    minHeight: 577,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    }
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // win.webContents.openDevTools();

  // Window
  ipcMain.handle("minimizeWin", () => {
    win.minimize();
  })

  ipcMain.handle("closeWin", () => {
    app.quit();
  })

  ipcMain.handle('patcherWin', () => {
    require('./Patcher');
  });

  ipcMain.handle("checkFileExists", async () => {
    const fileExists = fs.existsSync(process.env.LOCALAPPDATA + "\\Programs\\YandexMusic\\resources\\patched.txt");
    console.log(fileExists)
    return fileExists;
  });

  ipcMain.handle('requestTrackInfo', () => {
    metadata = getTrackInfo()
    return metadata;
  });

  const updateDiscordRPC = (RPC, data) => {
    const { playerBarTitle, artist, timecodes, requestImgTrack, linkTitle } = data;
    const timeRange = timecodes.length === 2 ? `${timecodes[0]} - ${timecodes[1]}` : '';
    const details = artist ? `${playerBarTitle} - ${artist}` : playerBarTitle;
    const largeImage = requestImgTrack[1] || 'ym';
    const smallImage = requestImgTrack[1] ? 'ym' : 'unset';
    const buttons = linkTitle ? [{
      label: '✌️ Open in YandexMusic',
      url: `yandexmusic://album/${encodeURIComponent(linkTitle)}`
    }] : null;
  
    RPC.setActivity({
      state: timeRange,
      details: details,
      largeImageKey: largeImage,
      smallImageKey: smallImage,
      smallImageText: 'Yandex Music',
      buttons: buttons
    });
  };  

  setInterval(() => {
    if (metadata) {
      updateDiscordRPC(rpc, metadata);
    }
  }, 1000);
}

app.on('ready', createWindow);
