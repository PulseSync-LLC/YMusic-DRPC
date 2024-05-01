import { Socket } from 'socket.io-client'

export default interface UserInterface {
    id: number
    login: string
    hasAvatar: boolean
    enableRpc: boolean
    enableRpcButtonListen: boolean
    autoStartMusic: boolean
    socket_connected: boolean
}
