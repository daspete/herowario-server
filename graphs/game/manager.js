import { Scene, NullEngine, ArcRotateCamera, Vector3 } from 'babylonjs'
import faker from 'faker'

import Provider from '~~/services/data/provider'
import DataPublisher from '~~/services/datapublisher'

import Sleep from '~~/utils/Sleep'

import Game from '~~/graphs/game/core/gameobjects/game'


const GameProvider = new Provider('games')

class GameManager {
    constructor(){
        this.game = null
        
        this.isReady = false
        this.started = false

        this.engine = new NullEngine()
        this.scene = new Scene(this.engine)
        this.camera = new ArcRotateCamera('Camera', 0, 0.8, 100, Vector3.Zero(), this.scene)


        this.Initialize()
    }

    async Initialize(){
        const gameData = await GameProvider.FindOne()

        this.game = new Game(gameData, this)

        this.isReady = true

        this.Start()
    }

    async Start(){
        await this.game.Start()

        this.started = true

        this.Update = this.Update.bind(this)
        this.engine.runRenderLoop(this.Update)

        this.StartNetwork()
    }

    async StartNetwork(){
        while(this.started){
            await Sleep(1000 / 2)
            this.NetworkUpdate()
        }
    }

    async NetworkUpdate(){
        DataPublisher.publish('game.update', { GameUpdate: this.game.Data })
    }

    async Update(){
        const dt = this.engine.getDeltaTime()

        this.game.Update()

        this.scene.render()
    }
}

const gameManager = new GameManager()

export default gameManager