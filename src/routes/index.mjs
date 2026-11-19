import { Router } from 'express'
import { loggerMiddleware } from '../middlewares/logger.mjs'

const router = Router()

router.get('/', loggerMiddleware, (req, res) => {
  res.send('Get root route')
})

export default router
