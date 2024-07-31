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
    status: boolean
    enableRpcButtonListen: boolean
    enableGithubButton: boolean
}

export default interface SettingsInterface {
    settings: Settings
    discordRpc: discordRpc
    tokens: Tokens
}
