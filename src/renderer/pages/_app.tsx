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

function app() {
    const [socketIo, setSocket] = useState<Socket | null>(null)
    const [socketError, setSocketError] = useState(0)
    const [socketConnected, setSocketConnected] = useState(false)
    const [user, setUser] = useState<UserInterface>(userInitials)
    const [settings, setSettings] = useState<SettingsInterface>(settingsInitials)
    const [loading, setLoading] = useState(false)
    const socket = io('http://localhost:1488', {
        autoConnect: false,
    })
    const router = createHashRouter([
        {
            path: '/',
            element: <AuthPage />,
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

    const authorize = () => {
        setLoading(true)
        const token = window.electron.store.get("token")
        console.log(token)

        return apolloClient
            .query({
                query: UserMeQuery,
            })
            .then((res) => {
                const { data } = res;
                console.log(data.getMe)
                if (data.getMe && data.getMe.id) {
                    setUser(data.getMe);
                    setLoading(false);

                    return true;
                } else {
                    setLoading(false);
                    //localStorage.removeItem("token")
                    return false;
                }
            })
            .catch(() => {
                setLoading(false);
                return false;
            });
    }
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = window.electron.store.get("token")
            console.log(user.id === '-1' && token)
            if(user.id === '-1' && token)
                authorize();
        }
    }, []);
    socket.on('connect', () => {
        console.log('Socket connected')
        console.log(socket.id)
        console.log(socketError)
        toast.success('Соединение установлено')
        socket.emit('connection')

        setSocket(socket)
        setSocketConnected(true)
        setLoading(false)
        if (socketError == 1) setSocketError(2)
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
        if (socketError === 1) {
            toast.error('Сервер не доступен')
        } else if (socketError === 2) {
            toast.success('Соединение восстановлено')
        }
    }, [socketError])

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
            if (!loading) {
                if (!socket.connected) socket.connect()
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
    const { user, socket, socketConnected, settings } = useContext(UserContext)
    const [track, setTrack] = useState<TrackInterface>(trackInitials)
    socket?.emit('ping')
    socket?.on('update-available', data => {
        toast.success('Update available: ' + data, {
            duration: 30000,
        })
        setTimeout(() => {
            socket?.emit('update-install')
        }, 5000)
    })
    useEffect(() => {
        if (user.id != "-1") {
            ;(async () => {
                if (socketConnected) {
                    if (typeof window !== 'undefined') {
                        if (settings.enableRpc) {
                            socket?.on('trackinfo', data => {
                                setTrack(data)
                            })
                        } else {
                            socket?.off('trackinfo')
                            setTrack(trackInitials)
                        }
                    }
                }
            })()
        }
    }, [user.id, socketConnected])
    useEffect(() => {
        if (settings.enableRpc) {
            //console.log(track)
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
                })
            }
        }
    }, [user, track])
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
