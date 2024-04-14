const http = require('http')
const fs = require('fs')

let jsonDataGET = {}
const themesPath = process.env.LOCALAPPDATA + '\\YDRPC Modification\\themes\\'

const server = http.createServer((req, res) => {
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'music-application://desktop',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
        })
        res.end()
        return
    }

    if (req.method === 'GET' && req.url === '/track_info') {
        res.writeHead(200, {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
        try {
            const data = require('fs').readFileSync('data.json', 'utf8')
            res.end(data)
        } catch (error) {
            console.error('Error getting track information:', error)
            res.end(
                JSON.stringify({ error: 'Error getting track information' }),
            )
        }
        return
    }

    if (req.method === 'POST' && req.url === '/update_data') {
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            try {
                const jsonData = JSON.parse(data)
                // console.log(jsonData);
                jsonDataGET = jsonData
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(
                    JSON.stringify({ message: 'Data received successfully' }),
                )
            } catch (error) {
                console.error('Error parsing JSON:', error)
                res.writeHead(400, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Invalid JSON' }))
            }
        })
        return
    }

    const path = require('path')

    if (req.method === 'GET' && req.url === '/style') {
        try {
            const confPath = themesPath + 'conf.json'
            let confData = fs.readFileSync(confPath, 'utf8')
            let conf = JSON.parse(confData)
            let stylePath = themesPath + conf.select

            if (!fs.existsSync(stylePath)) {
                stylePath = themesPath + 'Default'
                conf.select = 'Default'
                fs.writeFileSync(confPath, JSON.stringify(conf, null, 4))
            }

            let cssContent
            if (conf.select === 'Default') {
                cssContent = '{}'
            } else {
                const metadataPath = path.join(stylePath, 'metadata.json')
                if (!fs.existsSync(metadataPath)) {
                    stylePath = themesPath + 'Default'
                    conf.select = 'Default'
                    fs.writeFileSync(confPath, JSON.stringify(conf, null, 4))
                    cssContent = '{}'
                } else {
                    const styleContent = fs.readFileSync(metadataPath, 'utf8')
                    const style = JSON.parse(styleContent)
                    const styleCSS = path.join(stylePath, style.css)
                    cssContent = fs.readFileSync(styleCSS, 'utf8')
                }
            }

            res.writeHead(200, { 'Content-Type': 'text/css' })
            res.end(cssContent)
        } catch (error) {
            console.error('Error reading style file:', error)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Error reading style file' }))
        }
        return
    }

    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
})

const PORT = 19582
server.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`)
})

const getTrackInfo = () => {
    return jsonDataGET
}

module.exports = getTrackInfo
