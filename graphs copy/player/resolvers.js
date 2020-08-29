import { UserInputError } from 'apollo-server-express'
import DataPublisher from '~~/services/datapublisher'

import { ObjectId } from 'mongodb'

export default {
    Query: {
        async Players(root, {
            limit = 0,
            skip = 0
        }, { PlayerProvider }){
            let queryParams = {}

            return await PlayerProvider.Find({ filter: queryParams, limit: limit, skip: skip })
        },

        async PlayerById(root, { id }, { PlayerProvider, user }){
            if(!user) return null
            if(!user._id || !user.email) return null

            return await PlayerProvider.FindById(id)
        },

        async PlayerByName(root, { name }, { PlayerProvider, user }){
            if(!user) return null
            if(!user._id || !user.email) return null

            return await PlayerProvider.FindOne({ filter: { name } })
        },
    },

    Subscription: {
        PlayerCreated: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('player.create')
            }
        },

        PlayerUpdated: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('player.update')
            }
        },

        PlayerDeleted: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('player.delete')
            }
        },
    },

    Mutation: {
        async CreatePlayer(parent, { data }, { PlayerProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentPlayer = await PlayerProvider.Create(data)
            DataPublisher.publish('player.create', { PlayerCreated: currentPlayer })
            
            return currentPlayer
        },

        async UpdatePlayer(parent, { id, data }, { PlayerProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentPlayer = await PlayerProvider.FindById(id)
            if(!currentPlayer) throw new UserInputError('not_found')

            const updatedPlayer = await PlayerProvider.UpdateById(id, data)
            DataPublisher.publish('player.update', { PlayerUpdated: updatedPlayer })

            return updatedPlayer
        },

        async DeletePlayer(parent, { id }, { PlayerProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentPlayer = await PlayerProvider.FindById(id)
            if(!currentPlayer) throw new UserInputError('not_found')

            await PlayerProvider.DeleteById(id)
            DataPublisher.publish('player.delete', { PlayerDeleted: currentPlayer })

            return currentPlayer
        }
    },

    Player: {
        async user(parent, args, { UserProvider }){
            if(parent.user) return await UserProvider.FindById(parent.user)
            return null
        },

        async spaceships(parent, args, { SpaceshipProvider }){
            if(parent.spaceships) return await SpaceshipProvider.Find({ filter: { _id: { $in: parent.spaceships.map((spaceshipId) => { return new ObjectId(spaceshipId) }) }} })
            return null
        }
    },

    Planet: {
        async owner(parent, args, { PlayerProvider }){
            if(parent.owner) return await PlayerProvider.FindById(parent.owner)
            return null
        }
    },

    Game: {
        async players(parent, args, { PlayerProvider }){
            if(parent.players) return await PlayerProvider.Find({ filter: { _id: { $in: parent.players.map((planetId) => { return new ObjectId(planetId) }) }} })
            return null
        }
    }
}