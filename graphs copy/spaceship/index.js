import { GraphQLModule } from '@graphql-modules/core'

import resolvers from './resolvers'
import * as typeDefs from './schema.graphql'

import SpaceshipProvider from './provider'

import CommonGraph from '~~/graphs/common'

const graph = new GraphQLModule({
    typeDefs,
    resolvers,

    context(context){
        return {
            ...context,
            SpaceshipProvider
        }
    },

    imports: [
        CommonGraph
    ],
})

export default graph
