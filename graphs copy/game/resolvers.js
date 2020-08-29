import { UserInputError } from 'apollo-server-express'
import DataPublisher from '~~/services/datapublisher'



export default {
    Query: {
        async Games(root, {
            limit = 0,
            skip = 0
        }, { GameProvider }){
            let queryParams = {}

            return await GameProvider.Find({ filter: queryParams, limit: limit, skip: skip })
        },

        async GameById(root, { id }, { GameProvider, user }){
            if(!user) return null
            if(!user._id || !user.email) return null

            return await GameProvider.FindById(id)
        },

        async GameByName(root, { name }, { GameProvider, user }){
            if(!user) return null
            if(!user._id || !user.email) return null

            return await GameProvider.FindOne({ filter: { name } })
        },
    },

    Subscription: {
        GameCreated: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('game.create')
            }
        },

        GameUpdated: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('game.update')
            }
        },

        GameDeleted: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('game.delete')
            }
        },
    },

    Mutation: {
        async CreateGame(parent, { data }, { GameProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentGame = await GameProvider.Create(data)
            DataPublisher.publish('game.create', { GameCreated: currentGame })
            
            return currentGame
        },

        async UpdateGame(parent, { id, data }, { GameProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentGame = await GameProvider.FindById(id)
            if(!currentGame) throw new UserInputError('not_found')

            const updatedGame = await GameProvider.UpdateById(id, data)
            DataPublisher.publish('game.update', { GameUpdated: updatedGame })

            return updatedGame
        },

        async DeleteGame(parent, { id }, { GameProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentGame = await GameProvider.FindById(id)
            if(!currentGame) throw new UserInputError('not_found')

            await GameProvider.DeleteById(id)
            DataPublisher.publish('game.delete', { GameDeleted: currentGame })

            return currentGame
        }
    },

    Game: {
        async galaxy(parent, args, { GalaxyProvider }){
            if(parent.galaxy) return await GalaxyProvider.FindById(parent.galaxy)
            return null
        }
    }
}