import { GraphQLModule } from '@graphql-modules/core'

import resolvers from './resolvers'
import * as typeDefs from './schema.graphql'

import PlanetProvider from './provider'

import CommonGraph from '~~/graphs/common'


const graph = new GraphQLModule({
    typeDefs,
    resolvers,

    context(context){
        return {
            ...context,
            PlanetProvider,
        }
    },

    imports: [
        CommonGraph
    ],
})

export default graph
