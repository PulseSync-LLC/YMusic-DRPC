import { ipcMain } from 'electron'
import { Client } from '@xhayper/discord-rpc'
import { SetActivity } from '@xhayper/discord-rpc/dist/structures/ClientUser'
import { store } from './storage'
import logger from './logger'

const clientId = `984031241357647892`

const client = new Client({
    clientId,
    transport: {
        type: 'ipc',
    },
})

let rpcConnected = false

ipcMain.on('discordrpc-setstate', (event, activity: SetActivity) => {
    if (rpcConnected) {
        client.user?.setActivity(activity).catch((e) => {
            logger.discordRpc.error(e)
        })
    } else {
        rpc_connect()
    }
})
ipcMain.on('discordrpc-discordRpc', (event, val) => {
    console.log('discordRpc state: ' + val)
    store.set('discordRpc', val)
    if (val && !rpcConnected) {
        client.login().catch((e) => {
            logger.discordRpc.error(e)
        })
    } else {
        client.destroy().catch((e) => {
            logger.discordRpc.error(e)
        })
        rpcConnected = false
    }
})
client.on('disconnected', () => {
    rpcConnected = false
    logger.discordRpc.info('discordRpc state: closed')
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
client.on('ready', () => (rpcConnected = true))

function rpc_connect() {
    client.login().catch((e) => {
        logger.discordRpc.error(e)
    })
    rpcConnected = true
}

export default rpc_connect
