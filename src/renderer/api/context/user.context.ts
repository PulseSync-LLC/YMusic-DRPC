import { createContext } from 'react'
import UserInterface from '../interfaces/user.interface'
import userInitials from '../initials/user.initials'
import { Socket } from 'socket.io-client'
import TrackInterface from '../interfaces/track.interface'
import trackInitials from '../initials/track.initials'
import SettingsInterface from '../interfaces/settings.interface'
import settingsInitials from '../initials/settings.initials'
import { YandexMusicClient } from 'yandex-music-client'
import { AppInfoInterface } from '../interfaces/appinfo.interface'
import AppinfoInitials from '../initials/appinfo.initials'

interface p {
    user: UserInterface
    setUser: (userData: any) => void
    authorize?: () => void
    loading: boolean
    socket: Socket | null
    socketConnected: boolean
    app: SettingsInterface
    setApp: (settingsData: any) => void
    yaClient: YandexMusicClient
    setUpdate: (state: boolean) => void
    updateAvailable?: boolean
    setYaClient: (client: YandexMusicClient) => void
    appInfo: AppInfoInterface[]
}

const UserContext = createContext<p>({
    user: userInitials,
    setUser: () => void 0,
    authorize: () => void 0,
    loading: true,
    socket: null,
    socketConnected: false,
    app: settingsInitials,
    setApp: () => void 0,
    yaClient: null,
    setUpdate: () => void 0,
    updateAvailable: false,
    setYaClient: () => void 0,
    appInfo: AppinfoInitials,
})

export default UserContext
