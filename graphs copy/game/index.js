import { GraphQLModule } from '@graphql-modules/core'

import resolvers from './resolvers'
import * as typeDefs from './schema.graphql'

import GameProvider from './provider'

import GalaxyProvider from '~~/graphs/galaxy/provider'

import GalaxyGraph from '~~/graphs/galaxy'




const graph = new GraphQLModule({
    typeDefs,
    resolvers,

    context(context){
        return {
            ...context,
            GameProvider,
            GalaxyProvider
        }
    },

    imports: [
        GalaxyGraph
    ],
})

export default graph
