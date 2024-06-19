import { YandexMusicClient } from 'yandex-music-client'

let token: string | null = null
if (typeof window !== 'undefined') {
    token = sessionStorage.getItem('ya_token')
}

const client: YandexMusicClient = new YandexMusicClient({
    BASE: `http://localhost:${window.electron.corsAnywherePort()}/https://api.music.yandex.net`,
    HEADERS: {
        'Accept-Language': 'ru',
        Authorization: token ? `OAuth ${token}` : undefined,
        'X-Yandex-Music-Device': token
            ? window.electron.musicDevice()
            : undefined,
    },
})

export default client
