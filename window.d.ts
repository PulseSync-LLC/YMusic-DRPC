import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Presence } from 'discord-rpc'
import { Track } from 'yandex-music-client'

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
            patcher: {
                patch: () => void
                repatch: () => void
                depatch: () => void
            }
            request: (url: string, config: AxiosRequestConfig) => AxiosResponse
            corsAnywherePort: () => number
            musicDevice: () => string
            authorize: () => string
            version: () => string
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
            autoStartMusic: (val: boolean) => void
        }

        discordRpc: {
            enableRpc: (val: boolean) => void
            setActivity: (props: Presence) => void
            clearActivity: () => void
        }
    }
}

export {}
