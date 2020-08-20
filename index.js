import 'dotenv/config'

import os from 'os'
import http from 'http'
import morgan from 'morgan'
import cluster from 'cluster'
import passport from 'passport'

import express from '~~/services/express'
import socketio from '~~/services/socketio'
import graphql from '~~/services/graphql'
import authentication from '~~/services/authentication'

import corsConfig from '~~/config/cors'
import expressConfig from '~~/config/express'
import authConfig from '~~/config/auth'

import routes from '~~/routes'
// import sockets from '~~/sockets'

const isDevMode = !(process.env.NODE_ENV == 'production')
const clusterEnabled = process.env.CLUSTER_ENABLED == 'true' && !isDevMode

const RunApp = async () => {
    authentication(authConfig)
    
    const app = express({
        express: expressConfig,
        cors: corsConfig
    })

    // memory logging
    app.use((req, res, next) => {
        let memoryUsage = Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100
        console.info('memory usage: ', memoryUsage, 'MB')
        next()
    })

    // access logging
    app.use(morgan(expressConfig.logFormat, {
        skip(req, res){
            return false
        }
    }))

    app.use(passport.initialize())

    app.use(routes)
    
    

    // create main HTTP server
    const server = http.createServer(app)

    app.use('/graph', graphql.middleware)

    // create SocketIO server
    // socketio({ server, sockets })

    // Start HTTP server
    server.listen(expressConfig.port, expressConfig.ip, () => {
        graphql.StartSubscriptions(server)
        console.log(`Server is listening on ${ expressConfig.ip }:${ expressConfig.port }`)
    })
}

if(clusterEnabled){
    if(cluster.isMaster){
        let cpuCount = os.cpus().length
        let clusterCount = process.env.CLUSTERS || cpuCount
        if(clusterCount > cpuCount) clusterCount = cpuCount

        console.log(`Clustering to ${ clusterCount } instances...`)

        for(let i = 0; i < clusterCount; i++){
            cluster.fork()
        }
    }else{
        RunApp()
    }
}else{
    console.log('Start in single threaded mode...')
    RunApp()
}