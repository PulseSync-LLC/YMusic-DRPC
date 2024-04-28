import { createContext } from 'react'
import UserInterface from '../interfaces/user.interface'
import userInitials from '../interfaces/user.initials'
import { Socket } from 'socket.io-client'

interface p {
    user: UserInterface
    setUser: (userData: any) => void
    authorize?: () => void
    loading: boolean
    socket: Socket | null
}

const UserContext = createContext<p>({
    user: userInitials,
    setUser: () => void 0,
    authorize: () => void 0,
    loading: true,
    socket: null,
})

export default UserContext
