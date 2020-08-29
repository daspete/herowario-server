import { UserInputError } from 'apollo-server-express'
import DataPublisher from '~~/services/datapublisher'
import { ObjectId } from 'mongodb'

export default {
    Query: {
        async Galaxies(root, {
            limit = 0,
            skip = 0
        }, { GalaxyProvider }){
            let queryParams = {}

            return await GalaxyProvider.Find({ filter: queryParams, limit: limit, skip: skip })
        },

        async GalaxyById(root, { id }, { GalaxyProvider, user }){
            if(!user) return null
            if(!user._id || !user.email) return null

            return await GalaxyProvider.FindById(id)
        },

        async GalaxyByName(root, { name }, { GalaxyProvider, user }){
            if(!user) return null
            if(!user._id || !user.email) return null

            return await GalaxyProvider.FindOne({ filter: { name } })
        },
    },

    Subscription: {
        GalaxyCreated: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('galaxy.create')
            }
        },

        GalaxyUpdated: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('galaxy.update')
            }
        },

        GalaxyDeleted: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('galaxy.delete')
            }
        },
    },

    Mutation: {
        async CreateGalaxy(parent, { data }, { GalaxyProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentGalaxy = await GalaxyProvider.Create(data)
            DataPublisher.publish('galaxy.create', { GalaxyCreated: currentGalaxy })
            
            return currentGalaxy
        },

        async UpdateGalaxy(parent, { id, data }, { GalaxyProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentGalaxy = await GalaxyProvider.FindById(id)
            if(!currentGalaxy) throw new UserInputError('not_found')

            const updatedGalaxy = await GalaxyProvider.UpdateById(id, data)
            DataPublisher.publish('galaxy.update', { GalaxyUpdated: updatedGalaxy })

            return updatedGalaxy
        },

        async DeleteGalaxy(parent, { id }, { GalaxyProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentGalaxy = await GalaxyProvider.FindById(id)
            if(!currentGalaxy) throw new UserInputError('not_found')

            await GalaxyProvider.DeleteById(id)
            DataPublisher.publish('galaxy.delete', { GalaxyDeleted: currentGalaxy })

            return currentGalaxy
        }
    },

    Galaxy: {
        async planets(parent, args, { PlanetProvider }){
            if(parent.planets) return await PlanetProvider.Find({ filter: { _id: { $in: parent.planets.map((planetId) => { return new ObjectId(planetId) }) }} })
            return null
        }
    }
}