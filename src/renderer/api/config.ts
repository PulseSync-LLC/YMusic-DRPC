export const isDev = true

export default {
    SERVER_URL: isDev ? 'http://localhost:4000' : 'https://example.com',
    SOCKET_URL: isDev ? 'http://localhost:1337/' : 'https://example.com/',
}
