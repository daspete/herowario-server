import Provider from '~~/services/data/provider'
import DataPublisher from '~~/services/datapublisher'

import Spaceship from '~~/graphs/game/core/gameobjects/spaceship'

const SpaceshipProvider = new Provider('spaceships')
const UserProvider = new Provider('users')

export default class Player {
    constructor({ _id, user, name, spaceships }, gameManager){
        this._id = _id
        this.name = name
        this.spaceshipIds = spaceships
        this.spaceships = []
        this.userId = user
        this.user = null

        this.gameManager = gameManager
    }

    async Start(){
        this.user = JSON.parse(JSON.stringify(await UserProvider.FindById(this.userId)))
        
        const spaceshipsData = await SpaceshipProvider.Find({ filter: { _id: { $in: this.spaceshipIds } } })

        for(let i = 0; i < this.spaceshipIds.length; i++){
            const spaceship = new Spaceship(
                spaceshipsData.find((_spaceshipData) => {
                    return _spaceshipData._id.toString() == this.spaceshipIds[i].toString()
                }), 
                this,
                this.gameManager,
            )

            await spaceship.Start()

            this.spaceships.push(spaceship)
        }
    }

    Update(){
        for(let i = 0; i < this.spaceships.length; i++){
            this.spaceships[i].Update()
        }
    }

    get Data(){
        return {
            _id: this._id.toString(),
            name: this.name,
            user: this.user,
            spaceships: this.spaceships.map((spaceship) => {
                return spaceship.Data
            })
        }
    }
}

