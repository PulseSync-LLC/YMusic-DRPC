import { psList } from '@heyikang/ps-list'
import { exec } from 'child_process'
import path from 'path'
import util from 'util'

const execPromise = util.promisify(exec)

async function isProcessRunning(processName: string): Promise<number | null> {
    try {
        const modulesVendorPath = path.join(
            __dirname,
            '../../../../modules/vendor/',
        )
        const processes = await psList({
            pslistX64Path: modulesVendorPath + 'fastlist-0.3.0-x64.exe',
            pslistIa32Path: modulesVendorPath + 'fastlist-0.3.0-x86.exe',
        })
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

export default checkAndTerminateYandexMusic
