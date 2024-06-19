import type { Configuration } from 'webpack'

import { rules } from './webpack.rules'
import { plugins } from './webpack.plugins'

rules.push({
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
})

rules.push({
    test: /\.scss$/,
    use: [
        'style-loader',
        {
            loader: 'css-loader',
            options: {
                modules: {
                    localIdentName: '[name]__[local]___[hash:base64:5]',
                },
            },
        },
        'sass-loader',
    ],
})
rules.push({
    test: /\.svg$/,
    use: ['@svgr/webpack'],
})

rules.push({
    test: /\.md$/,
    use: [
        {
            loader: 'html-loader',
        },
        {
            loader: 'markdown-loader',
            options: {},
        },
    ],
})

export const rendererConfig: Configuration = {
    module: {
        rules,
    },
    plugins,
    resolve: {
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer'),
            assert: require.resolve('assert'),
            util: require.resolve('util'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify/browser'),
            url: require.resolve('url'),
        },
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    },
}
