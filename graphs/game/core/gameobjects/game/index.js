import Provider from '~~/services/data/provider'
import DataPublisher from '~~/services/datapublisher'

import Galaxy from '~~/graphs/game/core/gameobjects/galaxy'
import Player from '~~/graphs/game/core/gameobjects/player'

const GalaxyProvider = new Provider('galaxies')
const PlayerProvider = new Provider('players')

export default class Game {
    constructor({ _id, name, galaxy, players }, gameManager){
        this._id = _id
        this.name = name
        
        this.galaxyId = galaxy
        this.playerIds = players

        this.galaxy = null
        this.players = []
        
        this.gameManager = gameManager
    }

    async Start(){
        this.galaxy = new Galaxy(await GalaxyProvider.FindById(this.galaxyId), this.gameManager)

        const playersData = await PlayerProvider.Find({ filter: { _id: { $in: this.playerIds } } })

        for(let i = 0; i < this.playerIds.length; i++){
            const player = new Player(
                playersData.find((_playerData) => {
                    return _playerData._id.toString() == this.playerIds[i].toString()
                }), this.gameManager
            )

            await player.Start()

            this.players.push(player)
        }

        await this.galaxy.Start()

    }

    Update(){
        this.galaxy.Update()
        
        for(let i = 0; i < this.players.length; i++){
            this.players[i].Update()
        }
    }

    MoveSpaceship({ spaceshipId, playerId, direction }){
        const player = this.players.find((_player) => { return _player._id.toString() == playerId })
        if(!player) return

        const spaceship = player.spaceships.find((_spaceship) => { return _spaceship._id.toString() == spaceshipId })

        spaceship.SetMoveDirection(direction)
    }

    get Data(){
        return {
            _id: this._id.toString(),
            name: this.name,
            galaxy: this.galaxy.Data,
            players: this.players.map((player) => { return player.Data })
        }
    }
}