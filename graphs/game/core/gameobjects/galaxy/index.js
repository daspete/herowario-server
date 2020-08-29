import Provider from '~~/services/data/provider'
import DataPublisher from '~~/services/datapublisher'

import Planet from '~~/graphs/game/core/gameobjects/planet'

const PlanetProvider = new Provider('planets')

export default class Galaxy {
    constructor({ _id, name,planets }, gameManager){
        this._id = _id
        this.name = name
        this.planetIds = planets
        this.planets = []
        this.gameManager = gameManager
    }

    async Start(){
        const planetsData = await PlanetProvider.Find({ filter: { _id: { $in: this.planetIds } } })
        
        for(let i = 0; i < this.planetIds.length; i++){
            const planet = new Planet(
                planetsData.find((_planetData) => {
                    return _planetData._id.toString() == this.planetIds[i].toString()
                }), this.gameManager
            )

            await planet.Start()

            this.planets.push(planet)
        }
    }

    Update(){
        for(let i = 0; i < this.planets.length; i++){
            this.planets[i].Update()
        }
    }

    get Data(){
        return {
            _id: this._id.toString(),
            name: this.name,
            planets: this.planets.map((planet) => {
                return planet.Data
            })
        }
    }
}

