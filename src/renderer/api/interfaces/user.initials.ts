import UserInterface from './user.interface'
import { Socket } from 'socket.io-client'

const UserInitials: UserInterface = {
    id: -1,
    login: '',
    hasAvatar: false,
    enableRpc: false,
    enableRpcButtonListen: false,
    autoStartMusic: false,
    socket_connected: false,
}

export default UserInitials
