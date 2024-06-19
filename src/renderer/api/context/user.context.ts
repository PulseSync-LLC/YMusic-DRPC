import { createContext } from 'react'
import UserInterface from '../interfaces/user.interface'
import userInitials from '../interfaces/user.initials'
import { Socket } from 'socket.io-client'
import TrackInterface from '../interfaces/track.interface'
import trackInitials from '../interfaces/track.initials'
import SettingsInterface from '../interfaces/settings.interface'
import settingsInitials from '../interfaces/settings.initials'
import { YandexMusicClient } from 'yandex-music-client'

interface p {
    user: UserInterface
    setUser: (userData: any) => void
    authorize?: () => void
    loading: boolean
    socket: Socket | null
    socketConnected: boolean
    settings: SettingsInterface
    setSettings: (settingsData: any) => void
    yaClient: YandexMusicClient
    setYaClient: (client: YandexMusicClient) => void
}

const UserContext = createContext<p>({
    user: userInitials,
    setUser: () => void 0,
    authorize: () => void 0,
    loading: true,
    socket: null,
    socketConnected: false,
    settings: settingsInitials,
    setSettings: () => void 0,
    yaClient: null,
    setYaClient: () => void 0,
})

export default UserContext
