import { Router } from 'express'
import expressConfig from '~~/config/express'

import api from './api'

const router = new Router()

router.use(expressConfig.prefix, api)

export default router