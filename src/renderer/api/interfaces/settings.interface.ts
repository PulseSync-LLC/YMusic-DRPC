import { Socket } from 'socket.io-client'

export default interface SettingsInterface {
    discordRpc: boolean
    enableRpcButtonListen: boolean
    autoStartMusic: boolean
    patched: boolean
    readPolicy: boolean
    autoStartInTray: boolean
    yaToken: string
}
