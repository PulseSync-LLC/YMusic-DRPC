import { Server as SocketServer, Socket } from 'socket.io'
import { getLogger } from 'log4js'
import { getTrackInfo } from './httpServer'

export default class SocketService {
    private webSocket
    constructor() {
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

            setInterval(() => {
                let metadata = getTrackInfo()
                socket.emit('trackinfo', metadata)
                // console.log(metadata)
            }, 5000)
        })
    }
}
