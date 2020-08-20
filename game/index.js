import GameConfig from '~~/config/game'
import Sleep from '~~/utils/Sleep'

import Player from '~~/game/player'
import Planet from '~~/game/planet'

import { Scene, NullEngine, ArcRotateCamera, Vector3 } from 'babylonjs'
import faker from 'faker'

const config = GameConfig()

export default class Game {
    constructor(){
        this.config = config

        this.sockets = {}
        this.players = {}

        this.lastUpdateTime = Date.now()
        this.shouldSendUpdate = false

        this.engine = new NullEngine()
        this.scene = new Scene(this.engine)
        this.camera = new ArcRotateCamera('Camera', 0, 0.8, 100, Vector3.Zero(), this.scene)

        this.planets = []
        this.planetRange = 100000

        this.CreatePlanets()
    }

    CreatePlanets(){
        const planetCount = 800

        faker.seed(1234567)

        this.planets = []

        for(let i = 0; i < planetCount; i++){
            this.planets.push(new Planet({ 
                game: this,
                position: new Vector3(
                    faker.random.number(-this.planetRange, this.planetRange),
                    faker.random.number(-this.planetRange, this.planetRange),
                    faker.random.number(-this.planetRange, this.planetRange)
                ),
                stats: {
                    size: faker.random.number(150, 1000),
                    resources: {
                        wood: faker.random.number(50000000, 100000000),
                        stone: faker.random.number(50000000, 100000000),
                        blink: faker.random.number(50000000, 100000000),
                        copper: faker.random.number(50000000, 100000000),
                    }
                }
            }))
        }
    }

    Stop(){
        this.engine.stopRenderLoop(this.Update)
    }

    async Start(){
        this.Update = this.Update.bind(this)
        this.engine.runRenderLoop(this.Update)

        while(true){
            await Sleep(1000 / 12)
            this.NetworkUpdate()
        }
    }

    async Update(){
        const dt = this.engine.getDeltaTime()

        for(let i = 0; i < this.planets.length; i++) this.planets[i].Update(dt)

        const socketIds = Object.keys(this.sockets)
        for(let i = 0; i < socketIds.length; i++){
            this.players[socketIds[i]].Update(dt)
        }

        this.scene.render()
    }

    async NetworkUpdate(){
        const now = Date.now()
        const dt = (now - this.lastUpdateTime) / 1000
        this.lastUpdateTime = now

        // let socketIds = Object.keys(this.sockets)
        // for(let i = 0; i < socketIds.length; i++){
        //     let player = this.players[socketIds[i]]
        //     player.Update(dt)
        // }

        if(this.shouldSendUpdate){
            let socketIds = Object.keys(this.sockets)
            for(let i = 0; i < socketIds.length; i++){
                let socket = this.sockets[socketIds[i]]
                let player = this.players[socketIds[i]]

                socket.emit('game.update', this.GetUpdateData(player))

                player.LateNetworkUpdate()
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
            socket,
            username,
            userId,
            position: new Vector3(
                faker.random.number(-this.planetRange * 0.5, this.planetRange * 0.5),
                faker.random.number(-this.planetRange * 0.5, this.planetRange * 0.5),
                faker.random.number(-this.planetRange * 0.5, this.planetRange * 0.5)
            )
        })

        socket.on('planets', (callback) => {
            const planets = this.planets.map((planet) => {
                return planet.Data
            })

            callback(planets)
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

        const player = this.players[socket.id]

        switch(type){
            case 'keyboard':
                player.OnKey(data)
            break

            case 'pointer':
                player.OnPointer(data)
            break
        }
        
        // switch(type){
        //     case 'building.add':
        //         this.players[socket.id].AddBuilding(data.type)
        //     break

        //     case 'building.level.add':
        //         this.players[socket.id].AddBuildingLevels(data)
        //     break

        //     case 'building.production.stop':
        //         this.players[socket.id].StopProductionInBuilding(data)
        //     break

        //     case 'building.production.start':
        //         this.players[socket.id].StartProductionInBuilding(data)
        //     break
        // }

            
        
    }
}