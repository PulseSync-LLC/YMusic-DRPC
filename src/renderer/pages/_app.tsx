import React, { useContext, useEffect, useState } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import IndexPage from './main'
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

function app() {
    const [socketIo, setSocket] = useState<Socket | null>(null)
    const [socketError, setSocketError] = useState(0)
    const [user, setUser] = useState<UserInterface>(userInitials)
    const [loading, setLoading] = useState(false)
    const socket = io('http://localhost:1488', {
        autoConnect: false,
    })
    const router = createHashRouter([
        {
            path: '/',
            element: <IndexPage />,
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
    socket.on('connect', () => {
        console.log('Socket connected')
        console.log(socket.id)
        console.log(socketError)
        toast.success('Соединение установлено')
        socket.emit('connection')

        setSocket(socket)
        setUser(prevUser => ({
            ...prevUser,
            socket_connected: true,
        }))
        setLoading(false)
        if (socketError == 1) setSocketError(2)
    })

    socket.on('disconnect', (reason, description) => {
        console.log('Socket disconnected')
        console.log(reason + ' ' + description)
        console.log(socketError)

        setSocketError(1)
        setSocket(null)
        setUser(prevUser => ({
            ...prevUser,
            socket_connected: false,
        }))
    })

    socket.on('connect_error', err => {
        console.log('Socket connect error: ' + err)
        console.log(socketError)
        setSocketError(1)

        setSocket(null)
        setUser(prevUser => ({
            ...prevUser,
            socket_connected: false,
        }))
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
                setUser(prevUser => ({
                    ...prevUser,
                    enableRpc: true,
                }))
                setLoading(false)
            }
            if (window.electron.store.get('enableRpcButtonListen')) {
                setUser(prevUser => ({
                    ...prevUser,
                    enableRpcButtonListen: true,
                }))
                setLoading(false)
            }
            if (window.electron.store.get('patched')) {
                setUser(prevUser => ({
                    ...prevUser,
                    patched: true,
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
                value={{ user, setUser, loading, socket: socketIo }}
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
    const { user, socket } = useContext(UserContext)
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
        console.log(user)
        ;(async () => {
            if (user.socket_connected) {
                if (typeof window !== 'undefined') {
                    if (user.enableRpc) {
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
    }, [user])
    useEffect(() => {
        if (user.enableRpc) {
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
            const buttons = track.linkTitle
                ? [
                      {
                          label: '✌️ Open in YandexMusic',
                          url: `yandexmusic://album/${encodeURIComponent(track.linkTitle)}`,
                      },
                  ]
                : []
            if (user.enableRpcButtonListen) {
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
