import { UserInputError } from 'apollo-server-express'
import DataPublisher from '~~/services/datapublisher'

export default {
    Query: {
        async Spaceships(root, {
            limit = 0,
            skip = 0
        }, { SpaceshipProvider }){
            let queryParams = {}

            return await SpaceshipProvider.Find({ filter: queryParams, limit: limit, skip: skip })
        },

        async SpaceshipById(root, { id }, { SpaceshipProvider, user }){
            if(!user) return null
            if(!user._id || !user.email) return null

            return await SpaceshipProvider.FindById(id)
        },

        async SpaceshipByName(root, { name }, { SpaceshipProvider, user }){
            if(!user) return null
            if(!user._id || !user.email) return null

            return await SpaceshipProvider.FindOne({ filter: { name } })
        },
    },

    Subscription: {
        SpaceshipCreated: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('spaceship.create')
            }
        },

        SpaceshipUpdated: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('spaceship.update')
            }
        },

        SpaceshipDeleted: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('spaceship.delete')
            }
        },
    },

    Mutation: {
        async CreateSpaceship(parent, { data }, { SpaceshipProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentSpaceship = await SpaceshipProvider.Create(data)
            DataPublisher.publish('spaceship.create', { SpaceshipCreated: currentSpaceship })
            
            return currentSpaceship
        },

        async UpdateSpaceship(parent, { id, data }, { SpaceshipProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentSpaceship = await SpaceshipProvider.FindById(id)
            if(!currentSpaceship) throw new UserInputError('not_found')

            const updatedSpaceship = await SpaceshipProvider.UpdateById(id, data)
            DataPublisher.publish('spaceship.update', { SpaceshipUpdated: updatedSpaceship })

            return updatedSpaceship
        },

        async DeleteSpaceship(parent, { id }, { SpaceshipProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentSpaceship = await SpaceshipProvider.FindById(id)
            if(!currentSpaceship) throw new UserInputError('not_found')

            await SpaceshipProvider.DeleteById(id)
            DataPublisher.publish('spaceship.delete', { SpaceshipDeleted: currentSpaceship })

            return currentSpaceship
        }
    },
}