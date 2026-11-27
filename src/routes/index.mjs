import { Router } from 'express'
import { loggerMiddleware } from '../middlewares/logger.mjs'

const router = Router()

router.get('/', loggerMiddleware, (req, res) => {
  res.send('Get root route')
})

router.post('/theme', (req, res) => {
  if (!req.body) return res.status(400).send('Bad Request')
  const { theme } = req.body
  if (!theme || typeof theme !== 'string' || theme.trim() === '') {
    return res.status(400).send('Bad Request')
  }
  res.cookie('theme', theme, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
  res.json({ theme })
})

router.get('/theme', (req, res) => {
  const theme = req.cookies.theme || 'light'
  res.json({ theme })
})

router.get('/protected', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized')
  }
  const { password, ...safeUser } = req.user
  res.json({ message: 'Protected data', user: safeUser })
})

export default router
