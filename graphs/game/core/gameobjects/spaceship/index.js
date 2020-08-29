import DataPublisher from '~~/services/datapublisher'
import { Vector3 } from 'babylonjs'

export default class Spaceship {
    constructor({ _id, name, position }, player, gameManager){
        this._id = _id
        this.name = name
        this.position = new Vector3(position.x, position.y, position.z)
        
        this.player = player
        this.gameManager = gameManager
    }

    async Start(){
        
    }

    Update(){
        // this.position.x += 0.01
        // console.log('update spaceship')
    }

    SetMoveDirection(direction){
        // direction = new Vector3(direction.x, direction.y, direction.z)
        this.position.x += direction.x
        this.position.y += direction.y
        this.position.z += direction.z

        console.log(this.position)
    }

    get Data(){
        return {
            _id: this._id.toString(),
            name: this.name,
            position: this.position,
            playerId: this.player._id.toString()
        }
    }
}

