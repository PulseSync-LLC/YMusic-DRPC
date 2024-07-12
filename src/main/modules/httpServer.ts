import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import { mainWindow } from '../../index';
import { store } from './storage';

let jsonDataGET: any = {};
let selectedTheme: string = 'Default';  // Значение по умолчанию

const server = http.createServer();

server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': 'music-application://desktop',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
        });
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/track_info') {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            try {
                mainWindow.webContents.send('track_id', data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Data received successfully' }));
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    if (req.method === 'POST' && req.url === '/update_data') {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            try {
                jsonDataGET = JSON.parse(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Data received successfully' }));
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    if (req.method === 'POST' && req.url === '/send_token') {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            try {
                const token = JSON.parse(data);
                mainWindow.webContents.send('ya_token', token.value);
                store.set('ya_token', token.value);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Data received successfully' }));
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    if (req.method === 'GET' && req.url === '/get_theme') {
        try {
            const themesPath = path.join(app.getPath('appData'), 'PulseSync', 'themes');
            const themePath = path.join(themesPath, selectedTheme);
            const metadataPath = path.join(themePath, 'metadata.json');

            if (fs.existsSync(metadataPath)) {
                const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                let scriptJS = null;
                let cssContent = '';
                let jsContent = '';
                const styleCSS = path.join(themePath, metadata.css);
                if(metadata.script) {
                    scriptJS = path.join(themePath, metadata.script);
                    if (fs.existsSync(scriptJS)) {
                        jsContent = fs.readFileSync(scriptJS, 'utf8');
                    }
                }

                if (fs.existsSync(styleCSS)) {
                    cssContent = fs.readFileSync(styleCSS, 'utf8');
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    ok: true,
                    css: cssContent,
                    script: jsContent ? jsContent : '',
                }));
                return;
            }

            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Metadata not found' }));
        } catch (error) {
            console.error('Error reading theme files:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error reading theme files' }));
        }
        return;
    }


    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

export const getTrackInfo = () => {
    return jsonDataGET;
};

export const setTheme = (theme: string) => {
    selectedTheme = theme;
};

export default server;