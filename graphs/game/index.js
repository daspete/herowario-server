import { GraphQLModule } from '@graphql-modules/core'

import resolvers from './resolvers'
import * as typeDefs from './schema.graphql'

import GameProvider from './provider'

import UserProvider from '~~/graphs/user/provider'

import UserGraph from '~~/graphs/user'

const graph = new GraphQLModule({
    typeDefs,
    resolvers,

    context(context){
        return {
            ...context,
            GameProvider,
            UserProvider
        }
    },

    imports: [
        UserGraph
    ],
})

export default graph
