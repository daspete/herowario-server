import Game from '~~/game'
import GameConfig from '~~/config/game'

let game = new Game()

export default (io) => {
    console.log('Socket.IO initialized')

    game.Start()
    
    io.on('connection', (socket) => {
        console.log('player connected', socket.id)

        socket.on('disconnect', () => { game.RemovePlayer(socket) })

        socket.on('game.config', (callback) => {
            callback(GameConfig())
        })

        socket.on('player.join', (playerData, callback) => { 
            game.AddPlayer(socket, playerData) 
            callback(game.GetPlayerById(socket.id).Data) 
        })

        socket.on('player.input', (inputData) => { game.PlayerInput(socket, inputData) })
    })
}