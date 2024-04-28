import type { Configuration } from 'webpack'
import { rules } from './webpack.rules'

export const mainConfig: Configuration = {
    entry: './src/index.ts',
    target: 'electron-main',
    module: {
        rules,
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.json'],
    },
    externals: {
        electron: 'electron',
    },
}
