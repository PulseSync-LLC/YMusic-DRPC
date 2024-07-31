import { ipcMain } from 'electron'
import { Client } from '@xhayper/discord-rpc'
import { SetActivity } from '@xhayper/discord-rpc/dist/structures/ClientUser'
import { store } from './storage'
import logger from './logger'
import config from '../../config.json'

const clientId = config.CLIENT_ID ? config.CLIENT_ID : store.get("discordRpc.сlient_id")

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
    store.set('discordRpc.status', val)
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
function updateAppId(newAppId: string) {
    if(newAppId === config.CLIENT_ID) return;
    client.clientId = newAppId.length > 0 ? newAppId : config.CLIENT_ID.toString();
    store.set('discordRpc.сlient_id', newAppId)
    client.destroy().then(() => {
        client.login().catch((e) => {
            logger.discordRpc.error(e);
        });
    }).catch((e) => {
        logger.discordRpc.error(e);
    });
}
client.on('disconnected', () => {
    rpcConnected = false
    logger.discordRpc.info('discordRpc state: closed')
})

client.on('ERROR', () => {
    rpcConnected = false
    console.info('discordRpc: error')
})

ipcMain.on('discordrpc-clearstate', () => {
    if (rpcConnected) client.user?.clearActivity()
})
client.on('ready', () => {
    rpcConnected = true
    logger.discordRpc.info('discordRpc state: connected')
})

function rpc_connect() {
    client.login().catch((e) => {
        logger.discordRpc.error(e)
    })
    rpcConnected = true
}
const getRpcUser = () => {
    return client.user
}
export { rpc_connect, updateAppId, getRpcUser}
