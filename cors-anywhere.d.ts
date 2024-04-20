declare module 'cors-anywhere' {
    import { Server } from 'http'

    interface CorsAnywhereServer {
        listen(port: number, host: string, callback?: () => void): Server
    }

    function createServer(): CorsAnywhereServer

    export = { createServer }
}
