import { GraphQLModule } from '@graphql-modules/core'

import resolvers from './resolvers'
import * as typeDefs from './schema.graphql'

import PlayerProvider from './provider'

import UserProvider from '~~/graphs/user/provider'
import PlanetProvider from '~~/graphs/planet/provider'
import GameProvider from '~~/graphs/game/provider'
import SpaceshipProvider from '~~/graphs/spaceship/provider'

import UserGraph from '~~/graphs/user'
import PlanetGraph from '~~/graphs/planet'
import GameGraph from '~~/graphs/game'
import SpaceshipGraph from '~~/graphs/spaceship'

const graph = new GraphQLModule({
    typeDefs,
    resolvers,

    context(context){
        return {
            ...context,
            PlayerProvider,
            UserProvider,
            PlanetProvider,
            GameProvider,
            SpaceshipProvider
        }
    },

    imports: [
        UserGraph,
        PlanetGraph,
        GameGraph,
        SpaceshipGraph
    ],
})

export default graph
