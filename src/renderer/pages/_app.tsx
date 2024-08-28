import React, { useContext, useEffect, useRef, useState } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import UserMeQuery from '../api/queries/user/getMe.query'

import AuthPage from './auth'
import CallbackPage from './auth/callback'
import TrackInfoPage from './trackinfo'
import ExtensionPage from './extension'
import ExtensionBetaPage from './extensionbeta'
import JointPage from './joint'
import BugReportPage from './bugreport'

import hotToast, { Toaster } from 'react-hot-toast'
import { CssVarsProvider } from '@mui/joy'
import { Socket } from 'socket.io-client'
import UserInterface from '../api/interfaces/user.interface'
import userInitials from '../api/initials/user.initials'
import { io } from 'socket.io-client'
import UserContext from '../api/context/user.context'
import toast from '../api/toast'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import trackInitials from '../api/initials/track.initials'
import TrackInterface from '../api/interfaces/track.interface'
import PlayerContext from '../api/context/player.context'
import apolloClient from '../api/apolloClient'
import SettingsInterface from '../api/interfaces/settings.interface'
import settingsInitials from '../api/initials/settings.initials'
import getUserToken from '../api/getUserToken'
import { YandexMusicClient } from 'yandex-music-client'
import config from '../api/config'
import { AppInfoInterface } from '../api/interfaces/appinfo.interface'

import Preloader from '../components/preloader'
import { replaceParams } from '../utils/formatRpc'

function useKeyPressSound() {
    const soundFiles = {
        randomKeyPress: [
            '../../../static/assets/sounds/v1keyPress1.wav',
            '../../../static/assets/sounds/v1keyPress2.wav',
            '../../../static/assets/sounds/v1keyPress3.wav'
        ],
        backspace: '../../../static/assets/sounds/v1dropdownClose.wav', //test
        ctrlBackspace: '../../../static/assets/sounds/v2modalClose.wav', //test
        ctrlA: '../../../static/assets/sounds/v2modalOpen.wav', //test
        textSelection: '../../../static/assets/sounds/v1dropdownOpen.wav', //test
        deselection: '../../../static/assets/sounds/v1copy.wav', //test
        typingSpace: '../../../static/assets/sounds/v1buttonHover.wav', //test
        typingEnter: '' //test
    };

    const audioContext = useRef(new AudioContext());
    const audioRefs = useRef([]);

    const createAudio = async (soundFile: string) => {
        const response = await fetch(soundFile);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);

        const source = audioContext.current.createBufferSource();
        source.buffer = audioBuffer;

        const gainNode = audioContext.current.createGain();
        source.connect(gainNode);
        gainNode.connect(audioContext.current.destination);

        audioRefs.current.push({ source, gainNode });

        source.onended = () => {
            audioRefs.current = audioRefs.current.filter(a => a.source !== source);
        };

        return source;
    };

    const playSound = async (soundFile: string) => {
        const source = await createAudio(soundFile);
        source.start();
    };

    const playSoundWithPitch = async (soundFile: string, playbackRate: number) => {
        const source = await createAudio(soundFile);
        source.playbackRate.value = playbackRate;
        source.start();
    };

    return {
        playRandomKeyPressSound: () => {
            playSound(soundFiles.randomKeyPress[Math.floor(Math.random() * soundFiles.randomKeyPress.length)]);
        },
        playBackspaceSound: () => playSound(soundFiles.backspace),
        playCtrlBackspaceSound: () => playSound(soundFiles.ctrlBackspace),
        playCtrlASound: () => playSoundWithPitch(soundFiles.ctrlA, 0.5),
        playTextSelectionSound: (pitch: number) => playSoundWithPitch(soundFiles.textSelection, pitch),
        playDeselectionSound: () => playSound(soundFiles.deselection),
        playTypingSpaceSound: () => playSound(soundFiles.typingSpace),
        playTypingEnterSound: () => ""
    };
}


function _app() {
    const [socketIo, setSocket] = useState<Socket | null>(null)
    const [socketError, setSocketError] = useState(-1)
    const [socketConnected, setSocketConnected] = useState(false)
    const [updateAvailable, setUpdate] = useState(false)
    const [user, setUser] = useState<UserInterface>(userInitials)
    const [app, setApp] = useState<SettingsInterface>(settingsInitials)
    const [yaClient, setYaClient] = useState<YandexMusicClient | null>(null)
    const [loading, setLoading] = useState(true)
    const {
        playRandomKeyPressSound,
        playBackspaceSound,
        playCtrlBackspaceSound,
        playCtrlASound,
        playTextSelectionSound,
        playDeselectionSound,
        playTypingSpaceSound
    } = useKeyPressSound();
    const socket = io(config.SOCKET_URL, {
        autoConnect: false,
        auth: {
            token: getUserToken(),
        },
    })
    const [appInfo, setAppInfo] = useState<AppInfoInterface[]>([])
    const router = createHashRouter([
        {
            path: '/',
            element: <AuthPage />,
        },
        {
            path: '/auth/callback',
            element: <CallbackPage />,
        },
        {
            path: '/trackinfo',
            element: <TrackInfoPage />,
        },
        {
            path: '/extension',
            element: <ExtensionPage />,
        },
        {
            path: '/extensionbeta',
            element: <ExtensionBetaPage />,
        },
        {
            path: '/joint',
            element: <JointPage />,
        },
        {
            path: '/bugreport',
            element: <BugReportPage />,
        },
    ])
    const authorize = async () => {
        const token = await getUserToken()
        const sendErrorAuthNotify = () => {
            toast.error('Ошибка авторизации')
            window.desktopEvents?.send('show-notification', {
                title: 'Ошибка авторизации 😡',
                body: 'Произошла ошибка при авторизации в программе',
            })
        }
        if (token) {
            try {
                let res = await apolloClient.query({
                    query: UserMeQuery,
                    fetchPolicy: 'no-cache',
                })

                const { data } = res
                if (data.getMe && data.getMe.id) {
                    setUser(data.getMe)
                    await router.navigate('/trackinfo', {
                        replace: true,
                    })
                    window.desktopEvents?.send('authStatus', true)
                    return true
                } else {
                    setLoading(false)
                    window.electron.store.delete('tokens.token')

                    await router.navigate('/', {
                        replace: true,
                    })
                    setUser(userInitials)
                    sendErrorAuthNotify()
                    window.desktopEvents?.send('authStatus', false)
                    return false
                }
            } catch (e) {
                setLoading(false)
                sendErrorAuthNotify()

                if (window.electron.store.has('tokens.token')) {
                    window.electron.store.delete('tokens.token')
                }
                await router.navigate('/', {
                    replace: true,
                })
                setUser(userInitials)
                window.desktopEvents?.send('authStatus', false)
                return false
            }
        } else {
            window.desktopEvents?.send('authStatus', false)
            setLoading(false)
            return false
        }
    }
    useEffect(() => {
        let lastSelectionLength = 0;

        const playSoundForKey = (event: { target: any; ctrlKey: any; code: string; key: string | any[]; altKey: any; shiftKey: any }) => {
            const target = event.target;

            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                if (event.ctrlKey && event.code === 'KeyA') {
                    playCtrlASound();
                } else if (event.ctrlKey && event.key === 'Backspace') {
                    playCtrlBackspaceSound();
                } else if (event.key === 'Backspace') {
                    playBackspaceSound();
                } else if (event.key === ' ') {
                    playTypingSpaceSound();
                } else if (!event.ctrlKey && !event.altKey && event.key.length === 1) {
                    playRandomKeyPressSound();
                }
            }
        };

        const playSoundForSelectionChange = () => {
            const selection = document.getSelection();
            if (selection) {
                const currentSelectionLength = selection.toString().length;
                const pitch = 1 + Math.min(currentSelectionLength, 50) / 100;

                if (currentSelectionLength > 0 && currentSelectionLength !== lastSelectionLength) {
                    playTextSelectionSound(pitch);
                } else if (currentSelectionLength === 0 && lastSelectionLength > 0) {
                    playDeselectionSound();
                }
                lastSelectionLength = currentSelectionLength;
            }
        };

        document.addEventListener('keydown', playSoundForKey);
        document.addEventListener('selectionchange', playSoundForSelectionChange);

        return () => {
            document.removeEventListener('keydown', playSoundForKey);
            document.removeEventListener('selectionchange', playSoundForSelectionChange);
        };
    }, [playRandomKeyPressSound, playBackspaceSound, playCtrlBackspaceSound, playCtrlASound, playTextSelectionSound, playDeselectionSound, playTypingSpaceSound]);
    useEffect(() => {
        const handleMouseButton = (event: MouseEvent) => {
            if (event.button === 3) {
                event.preventDefault()
            }
            if (event.button === 4) {
                event.preventDefault()
            }
        }

        window.addEventListener('mouseup', handleMouseButton)

        return () => {
            window.removeEventListener('mouseup', handleMouseButton)
        }
    }, [])
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const checkAuthorization = async () => {
                await authorize()
            }

            if (user.id === '-1') {
                checkAuthorization()
            }
            // auth interval 15 minutes (10 * 60 * 1000)
            const intervalId = setInterval(checkAuthorization, 10 * 60 * 1000)

            return () => clearInterval(intervalId)
        }
    }, [])
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const ya_token = window.electron.store.get('tokens.ya_token')
            const client = new YandexMusicClient({
                BASE: `https://api.music.yandex.net`,
                HEADERS: {
                    'Accept-Language': 'ru',
                    Authorization: ya_token ? `OAuth ${ya_token}` : undefined,
                    'X-Yandex-Music-Device': ya_token
                        ? window.electron.musicDevice()
                        : undefined,
                },
            })
            setYaClient(client)
        }
    }, [app.tokens.ya_token])
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

        setSocketError(1)
        setSocket(null)
        setSocketConnected(false)
    })

    socket.on('connect_error', err => {
        console.log('Socket connect error: ' + err)
        setSocketError(1)

        setSocket(null)
        setSocketConnected(false)
    })

    useEffect(() => {
        if (socketError === 1 || socketError === 0) {
            toast.error('Сервер не доступен')
        } else if (socketConnected) {
            toast.success('Соединение восстановлено')
        }
    }, [socketError])
    useEffect(() => {
        if (user.id !== '-1') {
            if (!socket.connected) {
                socket.connect()
            }
            window.desktopEvents?.send('updater-start')
            if (
                !user.badges.some(badge => badge.type === 'supporter') &&
                app.discordRpc.enableGithubButton
            ) {
                setApp({
                    ...app,
                    discordRpc: {
                        ...app.discordRpc,
                        enableGithubButton: false,
                    },
                })
                window.electron.store.set(
                    'discordRpc.enableGithubButton',
                    false,
                )
            }
        } else {
            router.navigate('/', {
                replace: true,
            })
        }
    }, [user.id])

    useEffect(() => {
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
            window.desktopEvents?.on('ya_token', (event, data) => {
                setApp(prevSettings => ({
                    ...prevSettings,
                    tokens: {
                        ...prevSettings.tokens,
                        ya_token: data.ya_token,
                    },
                }))
            })
            window.desktopEvents
                ?.invoke('getVersion')
                .then((version: string) => {
                    setApp(prevSettings => ({
                        ...prevSettings,
                        info: {
                            ...prevSettings.info,
                            version: version,
                        },
                    }))
                })
            window.desktopEvents?.on('check-update', (event, data) => {
                let toastId: string
                toastId = hotToast.loading('Проверка обновлений', {
                    style: {
                        background: '#292C36',
                        color: '#ffffff',
                        border: 'solid 1px #363944',
                        borderRadius: '8px',
                    },
                })
                if (data.updateAvailable) {
                    console.log(data)
                    window.desktopEvents?.on(
                        'download-update-progress',
                        (event, value) => {
                            toast.loading(
                                <>
                                    <span>Загрузка обновления</span>
                                    <b style={{ marginLeft: '.5em' }}>
                                        {Math.floor(value)}%
                                    </b>
                                </>,
                                {
                                    id: toastId,
                                },
                            )
                        },
                    )
                    window.desktopEvents?.once(
                        'download-update-cancelled',
                        () => hotToast.dismiss(toastId),
                    )
                    window.desktopEvents?.once('download-update-failed', () =>
                        toast.error('Ошибка загрузки обновления', {
                            id: toastId,
                        }),
                    )
                    window.desktopEvents?.once('download-update-finished', () =>
                        toast.success('Обновление загружено', { id: toastId }),
                    )
                } else {
                    toast.error('Обновления не найдены', {
                        id: toastId,
                    })
                }
            })
            const fetchAppInfo = async () => {
                try {
                    const res = await fetch(
                        `${config.SERVER_URL}api/v1/app/info`,
                    )
                    const data = await res.json()
                    if (data.ok && Array.isArray(data.appInfo)) {
                        const sortedAppInfos = data.appInfo.sort(
                            (a: any, b: any) => b.id - a.id,
                        )
                        setAppInfo(sortedAppInfos)
                    } else {
                        console.error('Invalid response format:', data)
                    }
                } catch (error) {
                    console.error('Failed to fetch app info:', error)
                }
            }
            const fetchSettings = async () => {
                const keys = [
                    'settings.autoStartInTray',
                    'settings.autoStartApp',
                    'settings.autoStartMusic',
                    'settings.patched',
                    'settings.readPolicy',
                    'tokens.ya_token',
                    'tokens.token',
                    'discordRpc.enableRpcButtonListen',
                    'discordRpc.enableGithubButton',
                    'discordRpc.status',
                    'discordRpc.details',
                    'discordRpc.state',
                    'discordRpc.button',
                    'discordRpc.appId',
                ]

                const config = { ...settingsInitials } as any

                keys.forEach(key => {
                    const value = window.electron.store.get(key)
                    if (value !== undefined) {
                        const [mainKey, subKey] = key.split('.')
                        if (subKey) {
                            config[mainKey] = {
                                ...config[mainKey],
                                [subKey]: value,
                            }
                        }
                    }
                })

                setApp(config)
            }

            fetchSettings()
            fetchAppInfo()
            const token = window.electron.store.get('tokens.ya_token')
            if (token) {
                setApp(prevSettings => ({
                    ...prevSettings,
                    tokens: {
                        ...prevSettings.tokens,
                        token,
                    },
                }))
            }
        }
    }, [])
    return (
        <div className="app-wrapper">
            <Toaster />
            <UserContext.Provider
                value={{
                    user,
                    setUser,
                    authorize,
                    loading,
                    socket: socketIo,
                    socketConnected,
                    app,
                    setApp,
                    updateAvailable,
                    setUpdate,
                    setYaClient,
                    yaClient,
                    appInfo,
                }}
            >
                <Player>
                    <SkeletonTheme baseColor="#1c1c22" highlightColor="#333">
                        <CssVarsProvider>
                            {loading ? (
                                <Preloader />
                            ) : (
                                <RouterProvider router={router} />
                            )}
                        </CssVarsProvider>
                    </SkeletonTheme>
                </Player>
            </UserContext.Provider>
        </div>
    )
}
const Player: React.FC<any> = ({ children }) => {
    const { user, app } = useContext(UserContext)
    const [track, setTrack] = useState<TrackInterface>(trackInitials)

    useEffect(() => {
        if (user.id !== '-1') {
            ; (async () => {
                if (typeof window !== 'undefined') {
                    if (app.discordRpc.status) {
                        window.desktopEvents?.on('trackinfo', (event, data) => {
                            setTrack(prevTrack => ({
                                ...prevTrack,
                                playerBarTitle: data.playerBarTitle,
                                artist: data.artist,
                                timecodes: data.timecodes,
                                requestImgTrack: data.requestImgTrack,
                                linkTitle: data.linkTitle,
                            }))
                        })
                        window.desktopEvents?.on('track_id', (event, data) => {
                            setTrack(prevTrack => ({
                                ...prevTrack,
                                id: data,
                            }))
                        })
                    } else {
                        window.desktopEvents.removeListener(
                            'track-info',
                            setTrack,
                        )
                        setTrack(trackInitials)
                    }
                }
            })()
        } else {
            window.discordRpc.clearActivity()
        }
    }, [user.id, app.discordRpc.status])
    useEffect(() => {
        const updateDiscordRpc = () => {
            if (app.discordRpc.status && user.id !== '-1') {
                const timeRange = track.timecodes.length === 2
                    ? `${track.timecodes[0]} - ${track.timecodes[1]}`
                    : '';

                const details = track.artist.length > 0
                    ? `${track.playerBarTitle} - ${track.artist}`
                    : track.playerBarTitle;

                const activity: any = {
                    type: 2,
                    largeImageKey: track.requestImgTrack[1],
                    smallImageKey: 'https://cdn.discordapp.com/app-assets/984031241357647892/1180527644668862574.png',
                    smallImageText: 'Yandex Music',
                    state: app.discordRpc.state.length > 0
                        ? replaceParams(app.discordRpc.state, track)
                        : timeRange || 'Listening to music',
                    details: app.discordRpc.details.length > 0
                        ? replaceParams(app.discordRpc.details, track)
                        : details
                };

                if (app.discordRpc.enableRpcButtonListen && track.linkTitle) {
                    activity.buttons = [
                        {
                            label: app.discordRpc.button || '✌️ Open in Yandex Music',
                            url: `yandexmusic://album/${encodeURIComponent(track.linkTitle)}`
                        }
                    ];
                }

                if (app.discordRpc.enableGithubButton) {
                    activity.buttons = activity.buttons || [];
                    activity.buttons.push({
                        label: '♡ PulseSync Project',
                        url: `https://github.com/PulseSync-LLC/YMusic-DRPC/tree/patcher-ts`
                    });
                }

                if (activity.buttons.length === 0) {
                    delete activity.buttons
                }

                if (!track.artist && !timeRange) {
                    track.artist = 'Нейромузыка';
                    setTrack(prevTrack => ({
                        ...prevTrack,
                        artist: 'Нейромузыка',
                    }));
                    activity.details = `${track.playerBarTitle} - ${track.artist}`;
                }

                try {
                    window.discordRpc.setActivity(activity);
                } catch (error) {
                    console.error("Failed to set Discord activity:", error);
                }
            }
        };

        updateDiscordRpc();
    }, [app.settings, user, track, app.discordRpc])
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
export default _app
