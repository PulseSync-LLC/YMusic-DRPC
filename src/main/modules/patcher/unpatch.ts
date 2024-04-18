import { exec } from 'child_process'
import fs from 'fs'

const appAsarPath =
    process.env.LOCALAPPDATA + '\\Programs\\YandexMusic\\resources\\app.asar'

const patchedTxt =
    process.env.LOCALAPPDATA + '\\Programs\\YandexMusic\\resources\\patched.txt'

function deleteFiles(filePaths: string[]) {
    const deleteCommands = filePaths.map(filePath => `del "${filePath}"`)

    deleteCommands.forEach(command => {
        exec(command, (error, stdout, stderr) => {
            console.log(`Executing command: ${command}`)
            if (error) {
                console.error(`Ошибка при удалении файла: ${error}`)
                return
            }
            if (stderr) {
                console.error(`Ошибка при выполнении команды: ${stderr}`)
                return
            }
            console.log(`Файл успешно удален`)
        })
    })
}

function replaceFile(filePath: string) {
    const copyPath = `${filePath}.copy`

    if (!fs.existsSync(copyPath)) {
        console.error(`Файл ${copyPath} не найден`)
        return
    }

    const replaceCommand = `move /Y "${copyPath}" "${filePath}"`

    exec(replaceCommand, (error, stdout, stderr) => {
        console.log(`Executing command: ${replaceCommand}`)
        if (error) {
            console.error(`Ошибка при замене файла: ${error}`)
            return
        }
        if (stderr) {
            console.error(`Ошибка при выполнении команды: ${stderr}`)
            return
        }
        console.log(`Файл ${filePath} успешно заменен`)
    })
}

deleteFiles([appAsarPath, patchedTxt])

replaceFile(appAsarPath)
