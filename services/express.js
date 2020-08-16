import express from 'express'
import cors from 'cors'
import compression from 'compression'

import helmet from 'helmet'
import bodyParser from 'body-parser'

export default (config) => {
    const app = express()

    app.use(helmet.hsts({
        maxAge: 60 * 60 * 2,
        includeSubDomains: false
    }))

    app.use(cors(config.cors))
    app.use(compression())

    app.use(bodyParser.json({ limit: '64mb' }))
    app.use(bodyParser.urlencoded({ extended: true }))

    return app
}
