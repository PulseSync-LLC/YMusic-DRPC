import { Socket } from 'socket.io-client'

export default interface SettingsInterface {
    discordRpc: boolean
    enableRpcButtonListen: boolean
    patched: boolean
    readPolicy: boolean
    autoStartInTray: boolean
    autoStartApp: boolean
    ya_token: string
}
