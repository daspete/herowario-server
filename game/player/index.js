import { 
    Vector3, 
    AbstractMesh,
    Axis,
    Quaternion,
    Space,
    KeyboardEventTypes
} from 'babylonjs'

import Building from '~~/game/building'
import GameConfig from '~~/config/game'
import Sleep from '~~/utils/Sleep'

const config = GameConfig()

export default class Player {
    constructor({ game, id, socket, username, userId, position }){
        this.game = game
        this.id = id
        this.socket = socket
        this.userId = userId
        this.username = username
        this.config = config
        this.materials = JSON.parse(JSON.stringify(this.config.startMaterials))
        this.buildings = []

        // this.mesh = Mesh.CreateSphere(`player-${ this.id }`, 2, 1, this.game.scene)
        this.mesh = new AbstractMesh(`player-${ this.id }`, this.game.scene)
        this.mesh.player = this
        this.mesh.position = position

        this.stats = {
            hp: 1000,
            speed: 1,
        }

        this.moveSpeed = 1
        this.rollSpeed = 0.01

        this.tmpQuaternion = new Quaternion()
        this.moveVector = new Vector3(0, 0, 0)
        this.rotationVector = new Vector3(0, 0, 0)

        this.moveState = {
            forward: 0,
            x: 0,
            y: 0
        }

        console.log(`created player ${ username } ${ userId }`)
    }

    OnKey({ type, key }){
        switch(type){
            case KeyboardEventTypes.KEYDOWN:
                switch(key){
                    case 'w':
                    case 'ArrowUp':
                        this.moveState.forward = 1
                    break

                    case 's':
                    case 'ArrowDown':
                        this.moveState.forward = -1
                    break
                }
            break

            case KeyboardEventTypes.KEYUP:
                switch(key){
                    case 'w':
                    case 'ArrowUp':
                    case 's':
                    case 'ArrowDown':
                        this.moveState.forward = 0
                    break
                }
            break
        }
    }

    OnPointer({ type, x, y, canvas }){
        this.moveState.x = -2.0 * x / canvas.width + 1
        this.moveState.y = -2.0 * y / canvas.height + 1
    }

    Update(dt){
        this.moveVector.z = this.moveState.forward

        this.rotationVector.y = -this.moveState.x
        this.rotationVector.x = -this.moveState.y

        const moveSpeed = this.moveSpeed
        const rotationSpeed = this.rollSpeed

        this.mesh.translate(this.moveVector, moveSpeed, Space.LOCAL)

        this.tmpQuaternion.set(
            this.rotationVector.x * rotationSpeed,
            this.rotationVector.y * rotationSpeed,
            this.rotationVector.z * rotationSpeed,
            1
        ).normalize()

        this.mesh.rotate(Axis.Y, this.tmpQuaternion.y, Space.LOCAL)
        this.mesh.rotate(Axis.X, this.tmpQuaternion.x, Space.LOCAL)
        this.mesh.rotate(Axis.Z, this.tmpQuaternion.z, Space.LOCAL)

        // console.log(Object.keys(this.mesh))

        // for(let i = 0; i < this.buildings.length; i++){
        //     this.buildings[i].Update(dt)
        // }
        
    }

    LateNetworkUpdate(){}

    HasEnoughMaterials(neededMaterials){
        const materials = Object.keys(neededMaterials)

        let hasEnough = true
        const missingMaterials = []

        for(let i = 0; i < materials.length; i++){
            if(typeof this.materials[materials[i]] === 'undefined'){
                hasEnough = false
                missingMaterials.push(materials[i])
            }
            if(this.materials[materials[i]] - neededMaterials[materials[i]] < 0){
                hasEnough = false
                missingMaterials.push(materials[i])
            }
        }

        if(hasEnough) return true

        return missingMaterials
    }

    ReduceMaterials(neededMaterials){
        const materials = Object.keys(neededMaterials)

        for(let i = 0; i < materials.length; i++){
            this.materials[materials[i]] -= neededMaterials[materials[i]]
        }
    }

    AddBuilding(type){
        const buildingCost = this.config.buildings[type].build.cost
        const buildingMaterials = Object.keys(buildingCost)

        const hasEnoughMaterials = this.HasEnoughMaterials(buildingCost)

        if(hasEnoughMaterials !== true) return hasEnoughMaterials

        this.ReduceMaterials(buildingCost)

        const building = new Building({ game: this.game, player: this, type})
        this.buildings.push(building)

        return true
    }

    GetBuildingById(buildingId){
        return this.buildings.find((_building) => {
            return _building.id == buildingId
        })
    }

    StopProductionInBuilding({ buildingId }){
        let building = this.GetBuildingById(buildingId)
        building.StopProduction()
    }

    StartProductionInBuilding({ buildingId }){
        let building = this.GetBuildingById(buildingId)
        building.StartProduction()
    }

    AddBuildingLevels({ amount, buildingId }){
        let building = this.GetBuildingById(buildingId)
        building.AddLevels(amount)
    }

    get Data(){
        return {
            id: this.id,
            stats: this.stats,
            position: this.mesh.position,
            rotationQuaternion: this.mesh.rotationQuaternion,
            userId: this.userId,
            username: this.username,
            materials: this.materials,
            buildings: this.buildings.map((building) => {
                return building.Data
            })
        }
    }
}