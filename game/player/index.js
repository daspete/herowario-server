import Building from '~~/game/building'
import GameConfig from '~~/config/game'
import Sleep from '~~/utils/Sleep'

const config = GameConfig()

export default class Player {
    constructor({ game, id, username, userId }){
        this.game = game
        this.id = id
        this.userId = userId
        this.username = username
        this.config = config
        this.materials = JSON.parse(JSON.stringify(this.config.startMaterials))
        this.buildings = []

        console.log(`created player ${ username } ${ userId }`)
    }

    Update(dt){
        for(let i = 0; i < this.buildings.length; i++){
            this.buildings[i].Update(dt)
        }
    }

    LateUpdate(){}

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
            userId: this.userId,
            username: this.username,
            materials: this.materials,
            buildings: this.buildings.map((building) => {
                return building.Data
            })
        }
    }
}