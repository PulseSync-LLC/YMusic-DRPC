export interface Settings {
    patched: boolean
    readPolicy: boolean
    autoStartInTray: boolean
    autoStartMusic: boolean
    autoStartApp: boolean
}

export interface Tokens {
    ya_token: string
    token: string
}
export interface discordRpc {
    appId: string
    status: boolean
    enableRpcButtonListen: boolean
    details: string
    state: string
    button: string
    enableGithubButton: boolean
}

export default interface SettingsInterface {
    settings: Settings
    discordRpc: discordRpc
    tokens: Tokens
}
