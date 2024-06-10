import { app, nativeImage, NativeImage } from 'electron'
import path from 'path'

const getNativeImgFromUrl = async (url: string): Promise<NativeImage> => {
    const res = await fetch(`https://${url.replaceAll('%%', '100x100')}`)

    return nativeImage.createFromBuffer(Buffer.from(await res.arrayBuffer()))
}
const getNativeImg = (name: string, ext: string, useFor?: string) =>
    nativeImage.createFromPath(
        `${app.isPackaged ? process.resourcesPath + '/app.asar/.webpack/renderer/' : ''}main_window/static/assets/${
            useFor ? useFor + '/' : ''
        }${name}${ext}`,
    )

export { getNativeImg, getNativeImgFromUrl }
