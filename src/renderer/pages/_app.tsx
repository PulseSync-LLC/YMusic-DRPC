import React, { useContext, useEffect, useState } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import UserMeQuery from '../api/queries/user/getMe.query';

import TrackInfoPage from './trackinfo'
import ThemePage from './theme'
import JointPage from './joint'
import OtherPage from './other'

import { Toaster } from 'react-hot-toast'
import { CssVarsProvider } from '@mui/joy'
import { Socket } from 'socket.io-client'
import UserInterface from '../api/interfaces/user.interface'
import userInitials from '../api/interfaces/user.initials'
import { io } from 'socket.io-client'
import UserContext from '../api/context/user.context'
import toast from '../api/toast'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import trackInitials from '../api/interfaces/track.initials'
import TrackInterface from '../api/interfaces/track.interface'
import PlayerContext from '../api/context/player.context'
import apolloClient from '../api/apolloClient'
import SettingsInterface from '../api/interfaces/settings.interface'
import settingsInitials from '../api/interfaces/settings.initials'
import AuthPage from './auth'
import CallbackPage from './auth/callback'
import * as Sentry from '@sentry/electron/renderer'
import getUserToken from '../api/getUserToken'

function app() {
    const [socketIo, setSocket] = useState<Socket | null>(null)
    const [socketError, setSocketError] = useState(-1)
    const [socketConnected, setSocketConnected] = useState(false)
    const [user, setUser] = useState<UserInterface>(userInitials)
    const [settings, setSettings] = useState<SettingsInterface>(settingsInitials)
    const [loading, setLoading] = useState(false)
    const socket = io('https://socket.pulsesync.dev', {
        autoConnect: false,
        auth: {
            token: getUserToken(),
        },
    })
    const router = createHashRouter([
        {
            path: '/',
            element: <AuthPage />,
        },
        {
            path: "/auth/callback",
            element: <CallbackPage />,
        },
        {
            path: '/trackinfo',
            element: <TrackInfoPage />,
        },
        {
            path: '/theme',
            element: <ThemePage />,
        },
        {
            path: '/joint',
            element: <JointPage />,
        },
        {
            path: '/other',
            element: <OtherPage />,
        },
    ])
    const authorize = async () => {
        setLoading(true)
        const token = window.electron.store.get('token')
        console.log(token)

        try {
            let res = await apolloClient
                .query({
                    query: UserMeQuery
                })

            const { data } = res
            console.log(data)
            if (data.getMe && data.getMe.id) {
                setUser(data.getMe)
                setLoading(false)

                return true
            } else {
                setLoading(false)
                window.electron.store.delete('token')
                router.navigate("/")
                setUser(userInitials)
                return false
            }
        } catch (e) {
            setLoading(false)
            toast.error('Ошибка авторизации')

            if (window.electron.store.has('token')) {
                window.electron.store.delete('token')
            }
            await router.navigate("/")
            setUser(userInitials)
            return false
        }
    }
    useEffect(() => {
        if (typeof window !== 'undefined') {
                const token = window.electron.store.get("token")
                if(user.id === '-1' && token)
                {
                    authorize();
                }
                else {
                    router.navigate("/")
                }
        }
    }, []);
    socket.on('connect', () => {
        console.log('Socket connected')
        toast.success('Соединение установлено')
        socket.emit('connection')

        setSocket(socket)
        setSocketConnected(true)
        setLoading(false)
    })

    socket.on('disconnect', (reason, description) => {
        console.log('Socket disconnected')
        console.log(reason + ' ' + description)
        console.log(socketError)

        setSocketError(1)
        setSocket(null)
        setSocketConnected(false)
    })

    socket.on('connect_error', err => {
        console.log('Socket connect error: ' + err)
        console.log(socketError)
        setSocketError(1)

        setSocket(null)
        setSocketConnected(false)
    })

    // socket.on('userUpdate', args => {
    //     setUser(args)
    // })

    useEffect(() => {
        console.log(socketError)
        if (socketError === 1 || socketError === 0) {
            toast.error('Сервер не доступен')
        } else if (socketConnected) {
            toast.success('Соединение восстановлено')
        }
    }, [socketError])
    useEffect(() => {
        if (user.id !== "-1") {
            console.log("1")
            if (!socket.connected) socket.connect()
        }
    }, [user.id])

    useEffect(() => {
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
            if (window.electron.store.get('discordRpc')) {
                setSettings(prevSettings => ({
                    ...prevSettings,
                    enableRpc: true,
                }))
                setLoading(false)
            }
            if (window.electron.store.get('enableRpcButtonListen')) {
                setSettings(prevSettings => ({
                    ...prevSettings,
                    enableRpcButtonListen: true,
                }))
                setLoading(false)
            }
            if (window.electron.store.get('patched')) {
                setSettings(prevSettings => ({
                    ...prevSettings,
                    patched: true,
                }))
                setLoading(false)
            }
            if (window.electron.store.get('readPolicy')) {
                setSettings(prevSettings => ({
                    ...prevSettings,
                    readPolicy: true,
                }))
                setLoading(false)
            }
        }
    }, [])
    return (
        <div className="app-wrapper">
            <Toaster />
            <UserContext.Provider
                value={{ user, setUser, authorize, loading, socket: socketIo, socketConnected, settings, setSettings }}
            >
                <Player>
                    <SkeletonTheme baseColor="#1c1c22" highlightColor="#333">
                        <CssVarsProvider>
                            <RouterProvider router={router} />
                        </CssVarsProvider>
                    </SkeletonTheme>
                </Player>
            </UserContext.Provider>
        </div>
    )
}
const Player: React.FC<any> = ({ children }) => {
    const { user, socket, settings } = useContext(UserContext)
    const [track, setTrack] = useState<TrackInterface>(trackInitials)

    useEffect(() => {
        if (user.id != "-1") {
            ;(async () => {
                    if (typeof window !== 'undefined') {
                        if (settings.enableRpc) {
                            window.desktopEvents?.on('trackinfo', (event, data) => {
                                setTrack(data)
                            })
                        } else {
                            window.desktopEvents.removeListener('track-info', setTrack);
                            setTrack(trackInitials)
                        }
                    }
            })()
        }
    }, [user.id, settings.enableRpc])
    useEffect(() => {
        console.log("useEffect triggered");
        console.log("Settings: ", settings);
        console.log("User: ", user);
        console.log("Track: ", track);
        if (settings.enableRpc) {
            const timeRange =
                track.timecodes.length === 2
                    ? `${track.timecodes[0]} - ${track.timecodes[1]}`
                    : ''
            const details = track.artist
                ? `${track.playerBarTitle} - ${track.artist}`
                : track.playerBarTitle
            const largeImage = track.requestImgTrack[1] || 'ym'
            const smallImage = track.requestImgTrack[1] ? 'ym' : 'unset'
            const buttons = [
                {
                    label: '✌️ Open in YandexMusic',
                    url: `yandexmusic://album/${encodeURIComponent(track.linkTitle)}`,
                },
                {
                    label: '🤠 Open in GitHub',
                    url: `https://github.com/PulseSync-Official/YMusic-DRPC`,
                },
            ]
            if (settings.enableRpcButtonListen && track.linkTitle) {
                window.discordRpc.setActivity({
                    state: timeRange,
                    details: details,
                    largeImageKey: largeImage,
                    smallImageKey: smallImage,
                    smallImageText: 'Yandex Music',
                    buttons,
                })
            } else {
                window.discordRpc.setActivity({
                    state: timeRange,
                    details: details,
                    largeImageKey: largeImage,
                    smallImageKey: smallImage,
                    smallImageText: 'Yandex Music',
                    buttons: [
                        {
                            label: '🤠 Open in GitHub',
                            url: `https://github.com/PulseSync-Official/YMusic-DRPC`,
                        },
                    ]
                })
            }
        }
    }, [settings, user, track])
    return (
        <PlayerContext.Provider
            value={{
                currentTrack: track,
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}
export default app
