import { Router } from 'express'

const router = new Router()

router.get('/', (req, res, next) => {
    res.json({ api: 'test' })
})

export default router