import { UserInputError } from 'apollo-server-express'
import DataPublisher from '~~/services/datapublisher'

import GameManager from './manager'

export default {
    Query: {
        async Game(){
            return GameManager.game.Data
        }
    },

    Subscription: {
        GameUpdate: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('game.update')
            }
        }
    },

    Mutation: {
        async MoveSpaceship(root, args, context){
            GameManager.game.MoveSpaceship(args)
        }
    },

    Game: {
        
    }
}