import { Vector3, Mesh } from 'babylonjs'
import { nanoid } from 'nanoid'


export default class Planet {
    constructor({ game, position }){
        this.game = game
        this.id = nanoid()

        this.mesh = new Mesh.CreateSphere(`planet-${ this.id }`, 2, 1, this.game.scene)
        this.mesh.planet = this
        this.mesh.position = position

        this.resources = {
            wood: 1000000000,
            stone: 1000000000,
            blink: 1000000000,
            copper: 1000000000,
            quartz: 1000000000
        }

        this.owner = null
    }

    Update(){
        
    }

    get Data(){
        return {
            id: this.id,
            owner: this.owner?.Data,
            position: this.mesh.position,
            resources: this.resources
        }
    }
}