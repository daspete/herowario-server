import { UserInputError } from 'apollo-server-express'
import DataPublisher from '~~/services/datapublisher'

export default {
    Query: {
        async Planets(root, {
            limit = 0,
            skip = 0
        }, { PlanetProvider }){
            let queryParams = {}

            return await PlanetProvider.Find({ filter: queryParams, limit: limit, skip: skip })
        },

        async PlanetById(root, { id }, { PlanetProvider, user }){
            if(!user) return null
            if(!user._id || !user.email) return null

            return await PlanetProvider.FindById(id)
        },

        async PlanetByName(root, { name }, { PlanetProvider, user }){
            if(!user) return null
            if(!user._id || !user.email) return null

            return await PlanetProvider.FindOne({ filter: { name } })
        },
    },

    Subscription: {
        PlanetCreated: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('planet.create')
            }
        },

        PlanetUpdated: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('planet.update')
            }
        },

        PlanetDeleted: {
            subscribe(root, args, context){
                return DataPublisher.asyncIterator('planet.delete')
            }
        },
    },

    Mutation: {
        async CreatePlanet(parent, { data }, { PlanetProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentPlanet = await PlanetProvider.Create(data)
            DataPublisher.publish('planet.create', { PlanetCreated: currentPlanet })
            
            return currentPlanet
        },

        async UpdatePlanet(parent, { id, data }, { PlanetProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentPlanet = await PlanetProvider.FindById(id)
            if(!currentPlanet) throw new UserInputError('not_found')

            const updatedPlanet = await PlanetProvider.UpdateById(id, data)
            DataPublisher.publish('planet.update', { PlanetUpdated: updatedPlanet })

            return updatedPlanet
        },

        async DeletePlanet(parent, { id }, { PlanetProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentPlanet = await PlanetProvider.FindById(id)
            if(!currentPlanet) throw new UserInputError('not_found')

            await PlanetProvider.DeleteById(id)
            DataPublisher.publish('planet.delete', { PlanetDeleted: currentPlanet })

            return currentPlanet
        }
    },

    
}