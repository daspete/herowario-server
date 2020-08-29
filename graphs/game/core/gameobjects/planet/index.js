import DataPublisher from '~~/services/datapublisher'

import { Vector3 } from 'babylonjs'

export default class Planet {
    constructor({ _id, name, position }, gameManager){
        this._id = _id
        this.name = name
        this.position = new Vector3(position.x, position.y, position.z)

        this.gameManager = gameManager
    }

    async Start(){
        
    }

    Update(){
        this.position.x += 0.01
    }

    get Data(){
        return {
            _id: this._id.toString(),
            name: this.name,
            position: this.position
        }
    }
}

