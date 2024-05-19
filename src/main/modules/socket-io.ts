import { Server as SocketServer, Socket } from 'socket.io'
import { getLogger } from 'log4js'
import { getTrackInfo } from './httpServer'
import { getUpdater } from './updater/updater'
const updater = getUpdater()

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
            const _logger = getLogger('WS')
            _logger.info('WebSocket opened: ' + socket.id)
            socket.on('disconnect', () => {
                _logger.info('WebSocket disconnected: ' + socket.id)
            })
            socket.on('ping', () => {
                console.log('ping')
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
                    socket.emit('trackinfo', metadata)
            }, 5000)
        })
    }
}
