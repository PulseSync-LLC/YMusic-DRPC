import SettingsInterface from '../interfaces/settings.interface'

const settingsInitials: SettingsInterface = {
    settings: {
        patched: false,
        readPolicy: false,
        autoStartInTray: false,
        autoStartMusic: false,
        autoStartApp: false,
    },
    tokens: {
        ya_token: '',
        token: '',
    },
    discordRpc: {
        appId: "",
        enableRpcButtonListen: false,
        enableGithubButton: true,
        status: false,
        details: "",
        state: "",
        button: "",
    },
}

export default settingsInitials
