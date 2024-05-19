import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'

import MakerDMG from '@electron-forge/maker-dmg'
import config from './src/config.json'
import { mainConfig } from './webpack.main.config'
import { rendererConfig } from './webpack.renderer.config'
const forge_config: ForgeConfig = {
    packagerConfig: {
        icon: './static/assets/icon',
        name: 'PulseSync',
        asar: true,
        extraResource: ['./app-update.yml'],
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-zip',
            config: (arch: any) => ({
                macUpdateManifestBaseUrl: `${config.UPDATE_URL}/dev_build/darwin/${arch}`,
            }),
        },
        new MakerDMG({}),
        new MakerRpm({}),
        new MakerDeb({}),
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-s3',
            config: {
                keyResolver: (fileName: any, platform: any, arch: any) => {
                    return `dev_build/${platform}/${arch}/${fileName}`
                },
                endpoint: config.S3_ENDPOINT,
                bucket: config.S3_BUCKET,
                region: config.S3_REGION,
                accessKeyId: config.S3_ACCESS_KEY_ID,
                secretAccessKey: config.S3_SECRET_KEY,
                public: true,
            },
        },
    ],
    plugins: [
        new WebpackPlugin({
            mainConfig,
            renderer: {
                config: rendererConfig,
                entryPoints: [
                    {
                        name: 'preloader',
                        //html: './src/renderer/preloader.html',
                        js: './src/main/preload.ts',
                        preload: {
                            js: './src/main/preload.ts',
                        },
                    },
                    {
                        name: 'main_window',
                        html: './src/renderer/index.html',
                        js: './src/main/renderer.ts',
                        preload: {
                            js: './src/main/mainWindowPreload.ts',
                        },
                    },
                ],
            },
        }),
    ],
}

export default forge_config
