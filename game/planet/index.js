import { Vector3, Mesh } from 'babylonjs'
import { nanoid } from 'nanoid'


export default class Planet {
    constructor({ game, position, stats }){
        this.game = game
        this.id = nanoid()

        this.mesh = new Mesh.CreateSphere(`planet-${ this.id }`, 2, 1, this.game.scene)
        this.mesh.planet = this
        this.mesh.position = position

        this.stats = stats

        this.owner = null
    }

    Update(){
        
    }

    get Data(){
        return {
            id: this.id,
            owner: this.owner?.Data,
            position: this.mesh.position,
            stats: this.stats
        }
    }
}