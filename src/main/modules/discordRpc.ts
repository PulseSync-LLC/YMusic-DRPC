import { ipcMain } from 'electron'
import { Client } from '@xhayper/discord-rpc'
import { SetActivity } from '@xhayper/discord-rpc/dist/structures/ClientUser'
import { store } from './storage'
const clientId = `984031241357647892`

const client = new Client({
    clientId,
    transport: {
        type: 'ipc',
    },
})

let rpcConnected = false

ipcMain.on('discordrpc-setstate', (event, activity: SetActivity) => {
    console.log(activity)
    if (rpcConnected) client.user?.setActivity(activity)
})
ipcMain.on('discordrpc-enablerpc', (event, val) => {
    console.log('enablerpc')
    store.set('discordRpc', val)
    if (val) {
        client.login().catch(console.error)
        rpcConnected = true
    } else {
        client.destroy().catch(console.error)
        rpcConnected = false
    }
})

ipcMain.on('discordrpc-clearstate', () => {
    if (rpcConnected) client.user?.clearActivity()
})
client.on('debug', console.debug)
client.on('connected', () => (rpcConnected = true))
