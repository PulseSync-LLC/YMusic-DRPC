import UserInterface from './user.interface'
import { Socket } from 'socket.io-client'

const UserInitials: UserInterface = {
    id: '-1',
    avatar: '',
    username: '',
    perms: 'default',
    badges: [],
}

export default UserInitials
