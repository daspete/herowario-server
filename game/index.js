import GameConfig from '~~/config/game'
import Sleep from '~~/utils/Sleep'

import Player from '~~/game/player'

const config = GameConfig()

export default class Game {
    constructor(){
        this.config = config

        this.sockets = {}
        this.players = {}

        this.lastUpdateTime = Date.now()
        this.shouldSendUpdate = false

        this.isRunning = true
    }

    Stop(){
        this.isRunning = false
    }

    async Start(){
        while(this.isRunning){
            await Sleep(1000 / 10)
            this.Update()
        }
    }

    async Update(){
        const now = Date.now()
        const dt = (now - this.lastUpdateTime) / 1000
        this.lastUpdateTime = now

        let socketIds = Object.keys(this.sockets)
        for(let i = 0; i < socketIds.length; i++){
            let player = this.players[socketIds[i]]
            player.Update(dt)
        }



        if(this.shouldSendUpdate){
            socketIds = Object.keys(this.sockets)
            for(let i = 0; i < socketIds.length; i++){
                let socket = this.sockets[socketIds[i]]
                let player = this.players[socketIds[i]]

                socket.emit('game.update', this.GetUpdateData(player))

                player.LateUpdate()
            }

            this.shouldSendUpdate = false
        }else{
            this.shouldSendUpdate = true
        }
    }

    AddPlayer(socket, { username, userId }){
        this.sockets[socket.id] = socket

        this.players[socket.id] = new Player({
            game: this,
            id: socket.id,
            username,
            userId
        })
    }

    RemovePlayer(socket){
        delete this.sockets[socket.id]
        delete this.players[socket.id]
    }

    GetPlayerById(playerId){
        return this.players[playerId]
    }

    GetUpdateData(player){
        return {
            t: Date.now(),
            me: player.Data,
            others: Object.values(this.players)
                .filter((_player) => {
                    return _player.id !== player.id
                }).map((_player) => {
                    return _player.Data
                })
        }
    }

    PlayerInput(socket, { type, data }){
        if(!this.players[socket.id]) return

        
        switch(type){
            case 'building.add':
                this.players[socket.id].AddBuilding(data.type)
            break

            case 'building.level.add':
                this.players[socket.id].AddBuildingLevels(data)
            break
        }

            
        
    }
}