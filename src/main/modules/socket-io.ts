import { Server as SocketServer, Socket } from 'socket.io'
import { getLogger } from 'log4js'
import { getTrackInfo } from './httpServer'
import { getUpdater } from './updater/updater'
const updater = getUpdater()
import logger from './logger'
import { mainWindow } from '../../index'
export default class SocketService {
    private webSocket: SocketServer
    constructor() {
        //updater.start()
        this.webSocket = new SocketServer(1488, {
            cors: {
                origin: 'http://localhost:3000',
                credentials: true,
            },
            path: '/',
        })
        this.webSocket.on('connection', socket => {
            logger.main.info('WebSocket opened: ' + socket.id)
            socket.on('disconnect', () => {
                logger.main.info('WebSocket disconnected: ' + socket.id)
            })
            socket.on('ping', () => {
                logger.main.log('ping')
            })
            // TODO: enable autoUpdater when public release is ready
            // socket.on('update-install', () => {
            //     updater.install()
            // })
            // updater.onUpdate(version => {
            //     console.log(version)
            //     if (socket.connected) {
            //         socket.emit('update-available', version)
            //     }
            // })
            setInterval(() => {
                let metadata = getTrackInfo()
                if (Object.keys(metadata).length >= 1)
                    //socket.emit('trackinfo', metadata)
                    mainWindow.webContents.send("trackinfo", metadata);
            }, 5000)
        })
    }
}
