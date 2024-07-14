import * as fs from 'node:fs';
import * as path from 'node:path';
import { exec } from 'child_process';
import asar from '@electron/asar';

class Patcher {
    constructor() {}

    static findRumScript(startDir: string): string {
        const files = fs.readdirSync(startDir)
        for (const file of files) {
            const filePath = path.join(startDir, file)
            const stat = fs.statSync(filePath)
            if (stat.isDirectory()) {
                const rumScriptPath = this.findRumScript(filePath)
                if (rumScriptPath) {
                    return rumScriptPath
                }
            } else if (file === 'rumScript.js') {
                return filePath
            }
        }
        return null
    }

    static findConfig(startDir: string): string {
        const files = fs.readdirSync(startDir)
        for (const file of files) {
            const filePath = path.join(startDir, file)
            const stat = fs.statSync(filePath)
            if (stat.isDirectory()) {
                const configPath = this.findConfig(filePath)
                if (configPath) {
                    return configPath
                }
            } else if (file === 'config.js') {
                return filePath
            }
        }
        return null
    }

    static findEvents(startDir: string): string {
        const files = fs.readdirSync(startDir)
        for (const file of files) {
            const filePath = path.join(startDir, file)
            const stat = fs.statSync(filePath)
            if (stat.isDirectory()) {
                if (file === 'node_modules' || file === 'constants') {
                    continue
                }
                const eventsScriptPath = this.findEvents(filePath)
                if (eventsScriptPath) {
                    return eventsScriptPath
                }
            } else if (file === 'events.js') {
                return filePath
            }
        }
        return null
    }

    static copyFile(filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const copyCommand = `copy "${filePath}" "${filePath}.copy"`
            exec(copyCommand, (error, stdout, stderr) => {
                if (error) {
                    reject(`Ошибка при копировании файла: ${error}`)
                } else if (stderr) {
                    reject(`Ошибка при выполнении команды: ${stderr}`)
                } else {
                    console.log(`Файл успешно скопирован в ${filePath}.copy`)
                    resolve()
                }
            })
        })
    }

    static async patchRum(): Promise<any> {
        const appAsarPath =
            process.env.LOCALAPPDATA +
            '\\Programs\\YandexMusic\\resources\\app.asar'
        const destinationDir =
            process.env.LOCALAPPDATA + '\\Programs\\YandexMusic\\resources\\app'

        try {
            await this.copyFile(appAsarPath)
            console.log(`Extracting app.asar to ${destinationDir}...`)
            asar.extractAll(appAsarPath, destinationDir)

            await new Promise(resolve => setTimeout(resolve, 2000))

            const rumScriptPath = this.findRumScript(destinationDir)

            if (rumScriptPath) {
                let rumScriptContent = fs.readFileSync(rumScriptPath, 'utf8')

                rumScriptContent += `
                document.addEventListener('DOMContentLoaded', function() {
                                    let isScriptExecuted = false;
                                    let previousCss = '';
                                    let themeChanged = false;
                                    function addHtmlToBody() {
                                        const bodyElement = document.querySelector('body');
                
                                        if (bodyElement && !isScriptExecuted) {
                                            const customHtmlElement = document.createElement('div');
                                            customHtmlElement.style = "position: absolute;top: -7px;right: 140px;color: rgb(255 255 255 / 29%);font-family: var(--ym-font-text);font-style: normal;font-weight: 100;letter-spacing: normal;line-height: var(--ym-font-line-height-label-s);z-index: 1;"
                
                                            customHtmlElement.innerHTML = '<p class="PSB">PulseSync</p>';
                
                                            bodyElement.appendChild(customHtmlElement);
                
                                            isScriptExecuted = true;
                                            
                                            clearInterval(timerId);
                                        }
                                    }
                
                                    const timerId = setInterval(addHtmlToBody, 1000);
                
                                                                      
                                    function logPlayerBarInfo() {
                                        const playerBarTitleElement = document.querySelector('[class*="PlayerBarDesktop_description"] [class*="Meta_title"]');
                                        const linkTitleElement = document.querySelector('[class*="Meta_albumLink"]');
                                        const artistLinkElement = document.querySelector('[class*="PlayerBarDesktop_description"] [class*="Meta_artists"]');
                                        const timecodeElements = document.querySelectorAll('[class*="ChangeTimecode_timecode"]');
                                        const imgElements = document.querySelectorAll('[class*="PlayerBarDesktop_cover"]');
                                        imgElements.forEach(img => {
                                            if (img.src && img.src.includes('/100x100')) {
                                                img.src = img.src.replace('/100x100', '/1000x1000');
                                            }
                                            if (img.srcset && img.srcset.includes('/100x100')) {
                                                img.srcset = img.srcset.replace('/100x100', '/1000x1000');
                                            }
                                            if (img.srcset && img.srcset.includes('/200x200 2x')) {
                                                img.srcset = img.srcset.replace('/200x200 2x', '/1000x1000 2x');
                                            }
                                        });
                                        const titleText = playerBarTitleElement ? playerBarTitleElement.textContent.trim() : '';
                
                                        const artistTextElements = artistLinkElement ? artistLinkElement.querySelectorAll('[class*="Meta_artistCaption"]') : null;
                                        const artistTexts = artistTextElements ? Array.from(artistTextElements).map(element => element.textContent.trim()) : [];
                                        const linkTitle = linkTitleElement ? linkTitleElement.getAttribute('href') : '';
                                        const albumId = linkTitle ? linkTitle.split('=')[1] : '';
                                        let timecodesArray = Array.from(timecodeElements, (element) => element.textContent.trim());
                                        if (timecodesArray.length > 2) {
                                            timecodesArray = timecodesArray.slice(0, 2);
                                        }
                
                                        const ImgTrack = imgElements.length > 0 ? Array.from(imgElements, (element) => element.src) : [[None, 'ym']];
                
                                        return {
                                            playerBarTitle: titleText,
                                            artist: artistTexts.join(', '),
                                            timecodes: timecodesArray,
                                            requestImgTrack: ImgTrack,
                                            linkTitle: albumId
                                        };
                                    }
                
                                    setInterval(() => {
                                        const result = logPlayerBarInfo();
                
                                        fetch('http://127.0.0.1:19582/update_data', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify(result),
                                        });
                                    }, 1000);
                
                                
                                    function updateTheme() {
                                        fetch('http://127.0.0.1:19582/get_theme')
                                            .then(response => response.json())
                                            .then(data => {
                                                if (data.ok) {
                                                    var link = document.getElementById('dynamic-style');
                                    
                                                    if (data.css && data.css !== previousCss) {
                                                        if (!link) {
                                                            link = document.createElement('link');
                                                            link.id = 'dynamic-style';
                                                            link.rel = 'stylesheet';
                                                            link.type = 'text/css';
                                                            document.head.appendChild(link);
                                                        }
                                                        var cssBlob = new Blob([data.css], { type: 'text/css' });
                                                        var cssUrl = URL.createObjectURL(cssBlob);
                                                        link.href = cssUrl;
                                                        previousCss = data.css;
                                                    } 
                                                    if(data.css.trim() === "{}" ) {
                                                        if (link) {
                                                            link.remove();
                                                        }
                                                    }
                                    
                                                    var script = document.getElementById('dynamic-script');
                                                    if (data.script && data.script.trim() !== "") {
                                                        if (!script) {
                                                            var newScript = document.createElement('script');
                                                            newScript.id = 'dynamic-script';
                                                            newScript.type = 'application/javascript';
                                                            newScript.text = data.script;
                                                            document.head.appendChild(newScript);
                                                        } else if (script.text !== data.script) {
                                                            script.text = data.script;
                                                            themeChanged = true;
                                                        }
                                                    } else {
                                                        if (script && data.script.trim() !== "") {
                                                            themeChanged = true;
                                                        }
                                                    }
                                                    if (themeChanged) {
                                                        setTimeout(() => {
                                                            location.reload();
                                                        }, 100); 
                                                    }
                                                } else {
                                                    console.error('Failed to load theme:', data.error);
                                                }
                                            })
                                            .catch(error => console.error('Error fetching theme:', error));
                                    }
                                        updateTheme();
                                
                                        setInterval(updateTheme, 2000);
                });
                                    const token = localStorage.getItem("oauth"); 
                                    fetch('http://127.0.0.1:19582/send_token', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: token,
                                    });

                    `

                fs.writeFileSync(rumScriptPath, rumScriptContent)

                console.log(`Added script to ${rumScriptPath}`)
            } else {
                console.log(`Could not find rumScript.js in ${destinationDir}`)
            }

            const configPath = this.findConfig(destinationDir)

            if (configPath) {
                let configPathContent = fs.readFileSync(configPath, 'utf8')
                let cfgReplace = configPathContent.replace(
                    'enableDevTools: false',
                    'enableDevTools: true',
                )

                fs.writeFileSync(configPath, cfgReplace)

                let configPathContentWeb = fs.readFileSync(configPath, 'utf8')
                let websecReplace = configPathContentWeb.replace(
                    'enableWebSecurity: true',
                    'enableWebSecurity: false',
                )

                fs.writeFileSync(configPath, websecReplace)
                console.log(`Added script to ${configPath}`)
            }

            const eventsPath = this.findEvents(destinationDir)

            if (eventsPath) {
                let eventsPathContent = fs.readFileSync(eventsPath, 'utf8')
                const patchStr = `const handleApplicationEvents = (window) => {
    electron_1.session.defaultSession.webRequest.onCompleted({ urls: ['https://api.music.yandex.net/*'] }, (details) => {
            const url = details.url;
            const regex = /https:\\/\\/api\\.music\\.yandex\\.net\\/tracks\\/(\\d+)\\/download-info/;

            const match = url.match(regex);
            if (match && match[1]) {
                const trackId = match[1];
                console.log("Track ID found:", trackId);
                fetch("http://127.0.0.1:19582/track_info", {
                    method: "POST",
                    body: trackId
                })
            }
        });`
                let eventsReplace = eventsPathContent.replace(
                    `const handleApplicationEvents = (window) => {`,
                    patchStr,
                )

                fs.writeFileSync(eventsPath, eventsReplace)
                console.log(`Added script to ${eventsPath}`)

                console.log(`Packing app directory into app.asar...`)
                await asar.createPackage(destinationDir, appAsarPath)
                console.log(`App directory packed into ${appAsarPath}`)
                console.log(`Deleting source directory...`)
                return new Promise((resolve, reject) => {
                    exec(
                        `rmdir /s /q "${destinationDir}"`,
                        (deleteError, deleteStdout, deleteStderr) => {
                            if (deleteError) {
                                reject(
                                    `Error deleting source directory: ${deleteError.message}`,
                                )
                            } else if (deleteStderr) {
                                reject(`stderr: ${deleteStderr}`)
                            } else {
                                console.log(deleteStdout)
                                console.log(`Source directory deleted`)
                                resolve(true)
                            }
                        },
                    )
                })
            } else {
                console.log(`Could not find events.js in ${destinationDir}`)
                return Promise.resolve()
            }
        } catch (error) {
            console.error(`Error: ${error}`)
        }
    }
}

export default Patcher;
