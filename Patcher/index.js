const { ipcMain } = require('electron')
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

function findRumScript(startDir) {
    const files = fs.readdirSync(startDir)
    for (const file of files) {
        const filePath = path.join(startDir, file)
        const stat = fs.statSync(filePath)
        if (stat.isDirectory()) {
            const rumScriptPath = findRumScript(filePath)
            if (rumScriptPath) {
                return rumScriptPath
            }
        } else if (file === 'rumScript.js') {
            return filePath
        }
    }
    return null
}

function findConfig(startDir) {
    const files = fs.readdirSync(startDir)
    for (const file of files) {
        const filePath = path.join(startDir, file)
        const stat = fs.statSync(filePath)
        if (stat.isDirectory()) {
            const rumScriptPath = findConfig(filePath)
            if (rumScriptPath) {
                return rumScriptPath
            }
        } else if (file === 'config.js') {
            return filePath
        }
    }
    return null
}

function patcherym() {
    const appAsarPath =
        process.env.LOCALAPPDATA +
        '\\Programs\\YandexMusic\\resources\\app.asar'
    const destinationDir =
        process.env.LOCALAPPDATA + '\\Programs\\YandexMusic\\resources\\app'

    const command = `asar extract "${appAsarPath}" "${destinationDir}"`

    console.log(`Extracting app.asar to ${destinationDir}...`)

    const appPath =
        process.env.LOCALAPPDATA + '\\Programs\\YandexMusic\\resources'

    const filePath = path.join(appPath, 'patched.txt')

    fs.writeFile(filePath, 'done', err => {
        if (err) {
            console.error('Ошибка при создании файла:', err)
        } else {
            console.log('Файл успешно создан по пути:', filePath)
        }
    })

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`)
            return
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`)
            return
        }
        console.log(stdout)

        const rumScriptPath = findRumScript(destinationDir)

        if (rumScriptPath) {
            let rumScriptContent = fs.readFileSync(rumScriptPath, 'utf8')

            rumScriptContent += `
            let isScriptExecuted = false;

            function addHtmlToBody() {
                const bodyElement = document.querySelector('body');

                if (bodyElement && !isScriptExecuted) {
                    const customHtmlElement = document.createElement('div');
                    customHtmlElement.style = "position: absolute; top: -10px;"

                    customHtmlElement.innerHTML = '<p>YMusic-DRPC 2.0.5</p>';

                    bodyElement.appendChild(customHtmlElement);

                    isScriptExecuted = true;
                    
                    clearInterval(timerId);
                }
            }

            const timerId = setInterval(addHtmlToBody, 1000);

                                                      
            function logPlayerBarInfo() {
                const playerBarTitleElement = document.querySelector('[class*="Meta_albumLink"]');
                const artistLinkElement = document.querySelector('[class*="PlayerBarDesktop_description"] [class*="Meta_artists"]');
                const timecodeElements = document.querySelectorAll('[class*="ChangeTimecode_timecode"]');
                const imgElements = document.querySelectorAll('[class*="PlayerBarDesktop_cover"]');
                const titleText = playerBarTitleElement ? playerBarTitleElement.textContent.trim() : '';

                const artistTextElements = artistLinkElement ? artistLinkElement.querySelectorAll('[class*="Meta_artistCaption"]') : null;
                const artistTexts = artistTextElements ? Array.from(artistTextElements).map(element => element.textContent.trim()) : [];

                const linkTitle = playerBarTitleElement ? playerBarTitleElement.getAttribute('href') : '';
                const albumId = linkTitle ? linkTitle.split('=')[1] : '';

                const timecodesArray = Array.from(timecodeElements, (element) => element.textContent.trim());
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

            
            // let previousLinkElement = null;

            // setInterval(() => {
            //     const stylePath = 'http://127.0.0.1:19582/style.css';
            
            //     const newLinkElement = document.createElement('link');
            //     newLinkElement.rel = 'stylesheet';
            //     newLinkElement.href = stylePath;
            
            //     document.head.appendChild(newLinkElement);
            
            //     if (previousLinkElement) {
            //         setTimeout(() => {
            //             if (previousLinkElement.parentNode) {
            //                 previousLinkElement.parentNode.removeChild(previousLinkElement);
            //             }
            //         }, 1000);
            //     }
            
            //     previousLinkElement = newLinkElement;
            // }, 1000);
            
            `

            fs.writeFileSync(rumScriptPath, rumScriptContent)

            console.log(`Added script to ${rumScriptPath}`)
        } else {
            console.log(`Could not find rumScript.js in ${destinationDir}`)
        }

        const configPath = findConfig(destinationDir)

        if (configPath) {
            let configPathContent = fs.readFileSync(configPath, 'utf8')
            let cfgReplace = configPathContent.replace(
                'enableDevTools: false',
                'enableDevTools: true',
            )

            fs.writeFileSync(configPath, cfgReplace)

            const packCommand = `asar pack "${destinationDir}" "${appAsarPath}"`
            console.log(`Packing app directory into app.asar...`)
            exec(packCommand, (packError, packStdout, packStderr) => {
                if (packError) {
                    console.error(
                        `Error packing app directory: ${packError.message}`,
                    )
                    return
                }
                if (packStderr) {
                    console.error(`stderr: ${packStderr}`)
                    return
                }
                console.log(packStdout)
                console.log(`App directory packed into ${appAsarPath}`)

                console.log(`Deleting source directory...`)
                exec(
                    `rmdir /s /q "${destinationDir}"`,
                    (deleteError, deleteStdout, deleteStderr) => {
                        if (deleteError) {
                            console.error(
                                `Error deleting source directory: ${deleteError.message}`,
                            )
                            return
                        }
                        if (deleteStderr) {
                            console.error(`stderr: ${deleteStderr}`)
                            return
                        }
                        console.log(deleteStdout)
                        console.log(`Source directory deleted`)
                    },
                )
            })
        } else {
            console.log(`Could not find config.js in ${configPath}`)
        }
    })
}

patcherym()
