import 'dotenv/config'

import os from 'os'
import http from 'http'
import cluster from 'cluster'
import morgan from 'morgan'
import express from '~~/services/express'
import socketio from '~~/services/socketio'

import corsConfig from '~~/config/cors'
import expressConfig from '~~/config/express'

import routes from '~~/routes'
import sockets from '~~/sockets'

const isDevMode = !(process.env.NODE_ENV == 'production')
const clusterEnabled = process.env.CLUSTER_ENABLED == 'true' && !isDevMode

const RunApp = async () => {
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

    app.use(routes)

    // create main HTTP server
    const server = http.createServer(app)

    // create SocketIO server
    socketio({
        server,
        sockets
    })

    // Start HTTP server
    server.listen(expressConfig.port, expressConfig.ip, () => {
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