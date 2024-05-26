import { Socket } from 'socket.io-client'

export default interface SettingsInterface {
    enableRpc: boolean
    enableRpcButtonListen: boolean
    autoStartMusic: boolean
    patched: boolean
    readPolicy: boolean
}
