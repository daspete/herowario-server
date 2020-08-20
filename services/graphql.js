import { Router } from 'express'
import { ApolloServer } from 'apollo-server-express'
import { GraphQLModule } from '@graphql-modules/core'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'

import passport from 'passport'
import http from 'http'

import UserGraph from '~~/graphs/user'

const router = new Router()


// Auth middleware
router.use('/', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if(user) req.user = user
        next()
    })(req, res, next)
})

const { schema, schemaDirectives, context } = new GraphQLModule({
    imports: [
        UserGraph
    ],
    schemaDirectives: {}
})

const graphQLServer = new ApolloServer({
    schema,
    debug: process.env.NODE_ENV !== 'production',
    uploads: { 
        // maxFileSize: filesConfig.maxFileSize,
        // maxFiles: filesConfig.maxFiles
    },
    context: ({ req }) => {
        return {
            req: req,
            user: req.user,
            ...context
        }
    },
    introspection: true,

    plugins: [
        
    ],
})


graphQLServer.applyMiddleware({
    app: router,
    path: '/',
    bodyParserConfig: {
        limit: '64mb'
    }
})

export default {
    middleware: router,
    StartSubscriptions(server){
        // graphQLServer.installSubscriptionHandlers(server)

        new SubscriptionServer({
            execute,
            subscribe,
            schema,
            onConnect: (params, socket) => {
                console.log('bla', params)
            }
        }, {
            server: server,
            path: '/subscriptions'
        })
    }   
}