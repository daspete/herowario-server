import 'dotenv/config'

export default {
    socketPrefix: process.env.SOCKET_PREFIX || '/socket',
}