import { ipcMain } from 'electron'
import { Client } from '@xhayper/discord-rpc'
import { SetActivity } from '@xhayper/discord-rpc/dist/structures/ClientUser'
import { store } from './storage'
import logger from './logger'
import config from '../../config.json'

let clientId
let client: Client

let changeId = false
let rpcConnected = false

ipcMain.on('discordrpc-setstate', (event, activity: SetActivity) => {
    if (rpcConnected && client.isConnected) {
        client.user?.setActivity(activity).catch((e) => {
            logger.discordRpc.error(e)
        })
    } else if(!changeId){
        rpc_connect()
    }
})
ipcMain.on('discordrpc-discordRpc', (event, val) => {
    logger.discordRpc.info('discordRpc state: ' + val)
    store.set('discordRpc.status', val)
    if (val && !rpcConnected) {
        rpc_connect()
    } else {
        client.destroy().catch((e) => {
            logger.discordRpc.error(e)
        })
        rpcConnected = false
    }
})
function updateAppId(newAppId: string) {
    if(newAppId === config.CLIENT_ID) return;
    changeId = true
    store.set('discordRpc.appId', newAppId)
    client.destroy().then(() => {
        rpc_connect()
    }).catch((e) => {
        logger.discordRpc.error(e);
    });
}

ipcMain.on('discordrpc-clearstate', () => {
    if (rpcConnected) client.user?.clearActivity()
})

function rpc_connect() {
    const customId = store.get("discordRpc.appId")
    clientId = customId.length > 0 ? customId : config.CLIENT_ID
    client = new Client({
        clientId,
        transport: {
            type: 'ipc',
        },
    })
    client.login().catch((e) => {
        logger.discordRpc.error(e)
    })
    client.on('ready', () => {
        if(changeId) changeId = false
        rpcConnected = true
        logger.discordRpc.info('discordRpc state: connected')
    })
    client.on('disconnected', () => {
        rpcConnected = false
        logger.discordRpc.info('discordRpc state: disconnected')
    })

    client.on('error', () => {
        rpcConnected = false
        console.info('discordRpc state: error')
    })
    client.on('close', () => {
        rpcConnected = false
        console.info('discordRpc state: closed')
    })
}
const getRpcApp = () => {
    return client.application
}
export { rpc_connect, updateAppId, getRpcApp}
