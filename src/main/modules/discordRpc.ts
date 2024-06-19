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
    //console.log(activity)
    if (rpcConnected) {
        client.user?.setActivity(activity).catch(e => {
            console.error(e)
        })
    } else {
        rpc_connect()
    }
})
ipcMain.on('discordrpc-discordRpc', (event, val) => {
    console.log('discordRpc: ' + val)
    store.set('discordRpc', val)
    if (val && !rpcConnected) {
        client.login().catch(console.error)
    } else {
        client.destroy().catch(console.error)
        rpcConnected = false
    }
})
client.on('disconnected', () => {
    rpcConnected = false
    console.info('discordRpc: closed')
})

client.on('ERROR', () => {
    rpcConnected = false
    console.info('discordRpc: error')
})
ipcMain.on('discordrpc-enablerpcbuttonlisten', (event, val) => {
    console.log('enableRpcButtonListen: ' + val)
    store.set('enableRpcButtonListen', val)
})

ipcMain.on('discordrpc-clearstate', () => {
    if (rpcConnected) client.user?.clearActivity()
})
//client.on('debug', console.debug)
client.on('ready', () => (rpcConnected = true))

function rpc_connect() {
    client.login().catch(console.error)
    rpcConnected = true
}

export default rpc_connect
