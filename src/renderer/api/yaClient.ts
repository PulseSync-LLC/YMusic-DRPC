import { YandexMusicClient } from 'yandex-music-client'

const token = window.electron.store.get('token')
const client: YandexMusicClient = new YandexMusicClient({
    BASE: `http://127.0.0.1:${window.electron.corsAnywherePort()}/https://api.music.yandex.net`,
    HEADERS: {
        'Accept-Language': 'ru',
        Authorization: token ? `OAuth ${token}` : undefined,
        'X-Yandex-Music-Device': token
            ? window.electron.musicDevice()
            : undefined,
    },
})

export default client
