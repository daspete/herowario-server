import { GraphQLModule } from '@graphql-modules/core'

import resolvers from './resolvers'
import * as typeDefs from './schema.graphql'

import GalaxyProvider from './provider'

import PlanetProvider from '~~/graphs/planet/provider'

import PlanetGraph from '~~/graphs/planet'

const graph = new GraphQLModule({
    typeDefs,
    resolvers,

    context(context){
        return {
            ...context,
            GalaxyProvider,
            PlanetProvider
        }
    },

    imports: [
        PlanetGraph
    ],
})

export default graph
