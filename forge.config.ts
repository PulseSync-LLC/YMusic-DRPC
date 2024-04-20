import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'

import { mainConfig } from './webpack.main.config'
import { rendererConfig } from './webpack.renderer.config'
import MakerDMG from '@electron-forge/maker-dmg'

const config: ForgeConfig = {
    packagerConfig: {
        icon: './static/assets/icon',
        name: 'YMusic-DRPC',
    },
    rebuildConfig: {},
    makers: [
        new MakerSquirrel({}),
        new MakerZIP({}, ['darwin']),
        new MakerDMG({}),
        new MakerRpm({}),
        new MakerDeb({}),
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

export default config
