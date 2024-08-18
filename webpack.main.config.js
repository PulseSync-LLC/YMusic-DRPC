const path = require('path')
module.exports = {
    entry: './src/main/index.js',
    target: 'electron-main',
    externals: {
        electron: 'electron',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'static'),
        },
        extensions: [
            '.js',
            '.ts',
            '.jsx',
            '.tsx',
            '.css',
            '.scss',
            '.json',
            '.md',
            '.svg',
        ],
    },
    module: {
        rules: require('./webpack.rules'),
    },
}
