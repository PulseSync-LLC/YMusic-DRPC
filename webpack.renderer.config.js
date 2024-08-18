const rules = require('./webpack.rules')
const CopyPlugin = require("copy-webpack-plugin");

rules.push({
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
})

module.exports = {
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'static', to: 'static' },
                { from: 'static', to: 'main_window/static' },
            ],
        }),
    ],
    module: {
        rules,
    },

}
