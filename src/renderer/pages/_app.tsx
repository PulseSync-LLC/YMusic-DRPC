import React, { useEffect, useState } from 'react'
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

function app() {
    const [socketIo, setSocket] = useState<Socket | null>(null)
    const [socketError, setSocketError] = useState(0)
    const [user, setUser] = useState<UserInterface>(userInitials)
    const [loading, setLoading] = useState(false)
    const socket = io('localhost:1488', {
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
            if (
                window.electron.store.has('discordRpc') &&
                window.electron.store.get('discordRpc')
            ) {
                setUser(prevUser => ({
                    ...prevUser,
                    enableRpc: true,
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
                <SkeletonTheme baseColor="#1c1c22" highlightColor="#333">
                    <CssVarsProvider>
                        <RouterProvider router={router} />
                    </CssVarsProvider>
                </SkeletonTheme>
            </UserContext.Provider>
        </div>
    )
}

export default app
