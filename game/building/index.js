import GameConfig from '~~/config/game'
import Sleep from '~~/utils/Sleep'
import { nanoid } from 'nanoid'

const config = GameConfig()

export default class Building {
    constructor({ game, player, type }){
        this.game = game
        this.player = player
        this.type = type
        this.config = config
        this.id = nanoid()

        this.stats = JSON.parse(JSON.stringify(config.buildings[type]))

        this.buildStartTime = Date.now()
        this.lastProduceTime = {}
        this.lastLevelUpTime = Date.now()
        
        this.isBuilt = false
        this.isLeveling = false
        this.isProducing = true
        this.level = 0
    }

    Update(dt){
        if(this.isBuilt){
            if(this.isLeveling){
                this.Leveling()
            }else{
                this.Produce()
            }
            
        }else{
            this.Build()
        }
    }

    Build(){
        if(this.isBuilt == true) return

        const now = Date.now()

        if((now - this.buildStartTime) >= this.stats.build.time * 1000){
            this.isBuilt = true

            this.ResetProduce()
        }
    }

    Leveling(){
        if(!this.isLeveling) return 

        const now = Date.now()
        let level = this.level
        const buildingLevel = this.stats.levels[level]

        if(now - this.lastLevelUpTime >= buildingLevel.time * 1000){
            this.stats.grow = { ...buildingLevel.grow }
    
            this.ResetProduce()
    
            this.level++
            this.isLeveling = false
        }
    }

    Produce(){
        if(!this.isProducing) return

        const growingMaterials = Object.keys(this.stats.grow)

        for(let i = 0; i < growingMaterials.length; i++){
            this.ProduceMaterial(growingMaterials[i])
        }
    }

    StopProducing(){
        this.isProducing = false
    }

    StartProducing(){
        this.isProducing = true

        this.ResetProduce()
    }

    ResetProduce(){
        const growingMaterials = Object.keys(this.stats.grow)
    
        for(let i = 0; i < growingMaterials.length; i++){
            this.lastProduceTime[growingMaterials[i]] = Date.now()
        }
    }

    ProduceMaterial(type){
        const material = this.stats.grow[type]
        const lastProduceTime = this.lastProduceTime[type]
        const materialDependencies = this.config.materials[type].dependencies
        console.log(materialDependencies)

        const now = Date.now()

        if(now - lastProduceTime >= material.time * 1000){
            if(typeof this.player.materials[type] == 'undefined'){
                this.player.materials[type] = 0
            }

            this.player.materials[type] += material.amount
            this.lastProduceTime[type] = Date.now()
        }
    }

    AddLevels(amount){
        for(let i = 0; i < amount; i++){
            this.AddLevel()
        }
    }

    AddLevel(){
        let level = this.level
        const buildingLevel = this.config.buildings[this.type].levels[level]

        if(typeof buildingLevel === 'undefined') return
        if(this.player.HasEnoughMaterials(buildingLevel.cost) !== true) return

        this.player.ReduceMaterials(buildingLevel.cost)

        this.isLeveling = true
        this.lastLevelUpTime = Date.now()
    }

    get Data(){
        return {
            id: this.id,
            isBuilt: this.isBuilt,
            isLeveling: this.isLeveling,
            isProducing: this.isProducing,
            level: this.level + 1,
            now: Date.now(),
            buildStartTime: this.buildStartTime,
            lastProduceTime: this.lastProduceTime,
            lastLevelUpTime: this.lastLevelUpTime,
            type: this.type,
            stats: this.stats
        }
    }
}