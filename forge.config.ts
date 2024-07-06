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
import path from 'path'
import fs from 'fs-extra'

const forge_config: ForgeConfig = {
    packagerConfig: {
        icon: './icons/win/icon.ico',
        name: 'PulseSync',
        appCopyright: 'Copyright (C) 2024 PulseSync-Official',
        asar: true,
        win32metadata: {
            CompanyName: 'PulseSync-Official',
        },
        extraResource: ['./app-update.yml'],
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-zip',
            config: (arch: any) => ({
                macUpdateManifestBaseUrl: `${config.UPDATE_URL}/beta_build/darwin/${arch}`,
            }),
        },
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
                        html: './src/renderer/preloader.html',
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
    hooks: {
        packageAfterCopy: async (
            forgeConfig,
            buildPath,
            electronVersion,
            platform,
            arch,
        ) => {
            console.log(
                `build app ${platform}-${arch} with electron ${electronVersion}`,
            )

            const outDir = path.join(buildPath, '..', '..', 'modules')
            const sourceDir = path.join(__dirname, 'modules')
            await fs.ensureDir(outDir)
            await fs.copy(sourceDir, outDir)

            console.log(`Copied modules to ${outDir}`)
        },
    },
}

export default forge_config
