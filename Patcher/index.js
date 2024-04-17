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

function copyFile(filePath) {
    const copyCommand = `copy "${filePath}" "${filePath}.copy"`;
    exec(copyCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Ошибка при копировании файла: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`Ошибка при выполнении команды: ${stderr}`);
            return;
        }
        console.log(`Файл успешно скопирован в ${filePath}.copy`);
    });
}

function patcherym() {
    const appAsarPath =
        process.env.LOCALAPPDATA +
        '\\Programs\\YandexMusic\\resources\\app.asar'
    const destinationDir =
        process.env.LOCALAPPDATA + '\\Programs\\YandexMusic\\resources\\app'

    copyFile(appAsarPath);

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
                    customHtmlElement.style = "position: absolute;top: -7px;right: 140px;color: rgb(255 255 255 / 29%);font-family: var(--ym-font-text);font-style: normal;font-weight: 100;letter-spacing: normal;line-height: var(--ym-font-line-height-label-s);"

                    customHtmlElement.innerHTML = '<p class="YMDRCP">YMusic-DRPC 2.0.5</p>';

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

            
            function updateStyle() {
                var link = document.getElementById('dynamic-style');
                if (!link) {
                    link = document.createElement('link');
                    link.id = 'dynamic-style';
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    document.head.appendChild(link);
                }
                link.href = 'http://127.0.0.1:19582/style.css';
            }
            
            // Вызываем функцию обновления стиля каждые две секунды
            setInterval(updateStyle, 2000);
            
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

            let configPathContentweb = fs.readFileSync(configPath, 'utf8')
            let websecReplace = configPathContentweb.replace(
                'enableWebSecurity: true',
                'enableWebSecurity: false',
                )

            fs.writeFileSync(configPath, websecReplace)

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
