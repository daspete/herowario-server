import socketio from 'socket.io'

import socketConfig from '~~/config/sockets'

export default ({ server, sockets }) => {
    const io = socketio(server, socketConfig)

    sockets(io)

    return io
}