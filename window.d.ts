import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Track } from 'yandex-music-client'
import { SetActivity } from '@xhayper/discord-rpc/dist/structures/ClientUser'

declare global {
    interface Window {
        electron: {
            store: {
                get: (key: string) => any
                has: (key: string) => string
                set: (key: string, val: any) => void
                delete: (key: string) => void
            }
            window: {
                maximize: () => void
                minimize: () => void
                close: () => void
                isMac: () => boolean
            }
            player: {
                setTrack: (track: Track, currentPercent: number) => void
                setPlaying: (value: boolean) => void
            }
            request: (url: string, config: AxiosRequestConfig) => AxiosResponse
            corsAnywherePort: () => number
            musicDevice: () => string
            authorize: () => string
            version: () => string
            setTheme: (theme: 'dark' | 'light' | 'system') => void
            downloadTrack: (data: any) => void
            receive: (
                channel: string,
                func: (event: any, ...arg: any[]) => void,
            ) => void
            receiveOnce: (
                channel: string,
                func: (event: any, ...arg: any[]) => void,
            ) => void
            removeListener: (channel: string) => void
        }
        discordRPC: {
            setActivity: (props: SetActivity) => void
            clearActivity: () => void
        }
    }
}

export {}
