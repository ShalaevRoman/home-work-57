import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { SECRET } from '../middlewares/auth.mjs'

const router = Router()
const registeredUsers = new Map()

router.post('/register', (req, res) => {
  if (!req.body) return res.status(400).send('Bad Request')
  const { username, password } = req.body
  if (!username || typeof username !== 'string' || username.trim() === '' ||
      !password || typeof password !== 'string' || password.trim() === '') {
    return res.status(400).send('Bad Request')
  }
  if ([...registeredUsers.values()].find(u => u.username === username)) {
    return res.status(409).send('User already exists')
  }
  const id = randomUUID()
  registeredUsers.set(id, { id, username, password })
  const token = jwt.sign({ id, username }, SECRET, { expiresIn: '1h' })
  res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
  res.status(201).json({ id, username })
})

router.post('/login', (req, res) => {
  if (!req.body) return res.status(400).send('Bad Request')
  const { username, password } = req.body
  if (!username || typeof username !== 'string' || username.trim() === '' ||
      !password || typeof password !== 'string' || password.trim() === '') {
    return res.status(400).send('Bad Request')
  }
  const user = [...registeredUsers.values()].find(u => u.username === username && u.password === password)
  if (!user) {
    return res.status(401).send('Unauthorized')
  }
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' })
  res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
  res.json({ id: user.id, username: user.username })
})

export default router
