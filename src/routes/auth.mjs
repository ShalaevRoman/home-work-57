import { Router } from 'express'
import { randomUUID } from 'crypto'
import passport, { users } from '../config/passport.mjs'

const router = Router()

router.post('/register', (req, res) => {
  if (!req.body) return res.status(400).send('Bad Request')
  const { email, password } = req.body
  if (!email || typeof email !== 'string' || email.trim() === '' ||
      !password || typeof password !== 'string' || password.trim() === '') {
    return res.status(400).send('Bad Request')
  }
  if ([...users.values()].find(u => u.email === email)) {
    return res.status(409).send('User already exists')
  }
  const id = randomUUID()
  users.set(id, { id, email, password })
  res.status(201).json({ id, email })
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err)
    if (!user) return res.status(401).send('Unauthorized')
    req.logIn(user, (err) => {
      if (err) return next(err)
      res.json({ id: user.id, email: user.email })
    })
  })(req, res, next)
})

router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' })
  })
})

export default router
