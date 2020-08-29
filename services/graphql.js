import { Router } from 'express'
import { ApolloServer } from 'apollo-server-express'
import { GraphQLModule } from '@graphql-modules/core'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'
import jwt from 'jsonwebtoken'

import passport from 'passport'

import authConfig from '~~/config/auth'

import GameGraph from '~~/graphs/game'


const router = new Router()

import UserProvider from '~~/graphs/user/provider'

// Auth middleware
router.use('/', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if(user) req.user = user
        next()
    })(req, res, next)
})

const { schema, schemaDirectives, context } = new GraphQLModule({
    imports: [ GameGraph ],
    schemaDirectives: {}
})

const graphQLServer = new ApolloServer({
    schema,
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

    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production',
    debug: process.env.NODE_ENV !== 'production',
    
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
        new SubscriptionServer({
            execute,
            subscribe,
            schema,
            onConnect: (params, socket) => {
                if(params.authorization){
                    const token = params.authorization.replace('Bearer ', '')
                    const tokenValue = jwt.verify(token, authConfig.secret)
                    return { user: tokenValue.user }
                }
            }
        }, {
            server: server,
            path: '/subscriptions'
        })
    }   
}