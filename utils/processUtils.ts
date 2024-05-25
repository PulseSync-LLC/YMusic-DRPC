import psList from 'ps-list'
import { exec } from 'child_process'
import util from 'util'
import path from 'path'

const execPromise = util.promisify(exec)

async function isProcessRunning(processName: string): Promise<number | null> {
    try {
        const processes = await psList()
        const process = processes.find(p => p.name === processName)
        return process ? process.pid : null
    } catch (error) {
        console.error('Error while getting process list:', error)
        return null
    }
}

async function killProcess(pid: number): Promise<void> {
    try {
        await execPromise(`taskkill /PID ${pid} /F`)
        console.log(`Process with PID ${pid} killed.`)
    } catch (error) {
        console.error('Error while killing process:', error)
    }
}

async function checkAndTerminateYandexMusic() {
    const processName = 'Яндекс Музыка.exe'
    const pid = await isProcessRunning(processName)
    if (pid !== null) {
        console.log(`${processName} found process with ${pid}. Kill...`)
        await killProcess(pid)
    } else {
        console.log(`${processName} not found.`)
    }
}
export async function startYandexMusic() {
    let appPath = path.join(
        process.env.LOCALAPPDATA,
        'Programs',
        'YandexMusic',
        'Яндекс Музыка.exe',
    )
    appPath = `"${appPath}"`

    const command = `${appPath} --remote-allow-origins=*`
    try {
        await execPromise(command)
    } catch (error) {
        console.error(`Error while starting YandexMusic: ${error}`)
    }
}

export default checkAndTerminateYandexMusic
