import * as path from 'path'
import * as http from 'http'
import * as fs from 'fs'
import { getToken } from 'yandex-music-client/token'
import { mainWindow } from '../../index'
import { store } from './storage'

let jsonDataGET: any = {}
const themesPath: string = process.env.LOCALAPPDATA
    ? `${process.env.LOCALAPPDATA}\\YDRPC Modification\\themes\\`
    : ''

const server = http.createServer()

server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'music-application://desktop',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
        })
        res.end()
        return
    }

    if (req.method === 'POST' && req.url === '/track_info') {
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            try {
                mainWindow.webContents.send('track_id', data)
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

    if (req.method === 'POST' && req.url === '/update_data') {
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            try {
                jsonDataGET = JSON.parse(data)
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
    if (req.method === 'POST' && req.url === '/send_token') {
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            try {
                const token = JSON.parse(data)
                mainWindow.webContents.send('ya_token', token.value)
                store.set('ya_token', token.value)
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

    if (req.method === 'GET' && req.url === '/style.css') {
        try {
            const confPath = themesPath + 'conf.json'
            let confData = fs.readFileSync(confPath, 'utf8')
            let conf = JSON.parse(confData)
            let stylePath = themesPath + conf.select

            const setDefaultTheme = () => {
                stylePath = themesPath + 'Default'
                conf.select = 'Default'
                fs.writeFileSync(confPath, JSON.stringify(conf, null, 4))
                return '{}'
            }
            let cssContent
            if (!fs.existsSync(stylePath) || conf.select === 'Default') {
                cssContent = setDefaultTheme()
            } else {
                const metadataPath = path.join(stylePath, 'metadata.json')
                if (!fs.existsSync(metadataPath)) {
                    cssContent = setDefaultTheme()
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

    if (req.method === 'GET' && req.url === '/script.js') {
        try {
            const confPath = themesPath + 'conf.json'
            let confData = fs.readFileSync(confPath, 'utf8')
            let conf = JSON.parse(confData)
            let scriptPath = themesPath + conf.select

            const setDefaultTheme = () => {
                scriptPath = themesPath + 'Default'
                conf.select = 'Default'
                fs.writeFileSync(confPath, JSON.stringify(conf, null, 4))
                return '{}'
            }

            let jsContent
            if (!fs.existsSync(scriptPath) || conf.select === 'Default') {
                jsContent = setDefaultTheme()
            } else {
                const metadataPath = path.join(scriptPath, 'metadata.json')
                if (!fs.existsSync(metadataPath)) {
                    jsContent = setDefaultTheme()
                } else {
                    const scriptContent = fs.readFileSync(metadataPath, 'utf8')
                    const script = JSON.parse(scriptContent)

                    if (script && script.script) {
                        const scriptJS = path.join(scriptPath, script.script)
                        jsContent = fs.readFileSync(scriptJS, 'utf8')
                    } else {
                        jsContent = setDefaultTheme()
                    }
                }
            }

            res.writeHead(200, { 'Content-Type': 'application/javascript' })
            res.end(jsContent)
        } catch (error) {
            console.error('Error reading script file:', error)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Error reading script file' }))
        }
        return
    }

    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
})

export const getTrackInfo = () => {
    return jsonDataGET
}

export default server
