import Game from '~~/game'
import { nanoid } from 'nanoid'

import Sleep from '~~/utils/Sleep'

const FetchEmit = async (type, data) => {
    // console.log(data.me.materials)
}

const RunApp = async () => {
    
    const game = new Game()
    game.Start()

    let playerId = nanoid()

    game.AddPlayer({ id: playerId, emit(type, data){
        FetchEmit(type, data)
    } }, { username: 'testing' })
    const player = game.GetPlayerById(playerId)

    player.AddBuilding('woodcutter')

    await Sleep(5000)

    player.AddBuilding('blinkmaker')

    const randomBuildings = [
        'woodcutter',
        'blinkmaker',
        'stonehut'
    ]

    for(let i = 0; i < 500; i++){
        await Sleep(500)
        let randomBuildingTypeIndex = Math.floor(Math.random() * randomBuildings.length)
        
        let buildStatus = player.AddBuilding(randomBuildings[randomBuildingTypeIndex])

        if(buildStatus !== true){
            i--
        }

    }
}



RunApp()