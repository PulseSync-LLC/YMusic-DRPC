import { TrackDownloadInfo, YandexMusicClient } from 'yandex-music-client'
import { createHash } from 'crypto'

export interface DownloadInfo {
    s: string
    ts: string
    path: string
    host: string
}

export default async function getTrackUrl(
    client: YandexMusicClient,
    trackId: string,
    highRate?: boolean,
) {
    const trackInfo = await client.tracks.getDownloadInfo(trackId)
    const downloadInfo = await getDownloadInfo(
        trackInfo.result,
        client.request.config.HEADERS,
        highRate,
    )
    const url = createTrackURL(downloadInfo)

    return url
}

async function getDownloadInfo(
    trackInfo: TrackDownloadInfo[],
    headers?: any,
    highRate?: boolean,
): Promise<any> {
    const isAuthorized = true
    const info = isAuthorized
        ? trackInfo
              .filter(item => item.codec === 'mp3' && !item.preview)
              .reduce((prev, current) => {
                  if (highRate)
                      return prev.bitrateInKbps > current.bitrateInKbps
                          ? prev
                          : current
                  else
                      return prev.bitrateInKbps < current.bitrateInKbps
                          ? prev
                          : current
              })
        : trackInfo[0]

    return await fetch(`${info!.downloadInfoUrl}&format=json`, {
        headers,
    }).then(async res => {
        const j = await res.json()
        return j
    })
}

function createTrackURL(info: any) {
    console.log(info)
    // тут мы можем увидеть традиционный хеш
    const trackUrl = `XGRlBW9FXlekgbPrRHuSiA${info.path.substr(1)}${info.s}`
    const hashedUrl = createHash('md5').update(trackUrl).digest('hex')
    const link = `https://${info.host}/get-mp3/${hashedUrl}/${info.ts}${info.path}`

    return link
}