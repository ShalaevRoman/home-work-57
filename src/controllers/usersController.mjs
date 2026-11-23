import { users } from '../models/users.mjs'

export const getUsers = (req, res) => {
  const result = Array.from(users.entries()).map(([id, data]) => ({ id, ...data }))
  res.render('users.pug', { users: result })
}

export const createUser = (req, res, next) => {
  try {
    const { name } = req.body
    const id = String(Date.now())
    users.set(id, { name })
    res.status(201).json({ id, name })
  } catch (err) {
    next(err)
  }
}

export const getUserById = (req, res) => {
  const user = users.get(req.params.userId)
  if (!user) return res.status(404).send('Not Found')
  res.render('user.pug', { user: { id: req.params.userId, ...user } })
}

export const updateUser = (req, res) => {
  const { name } = req.body
  if (!users.has(req.params.userId)) {
    return res.status(404).send('Not Found')
  }
  users.set(req.params.userId, { name })
  res.json({ id: req.params.userId, name })
}

export const deleteUser = (req, res) => {
  if (!users.has(req.params.userId)) {
    return res.status(404).send('Not Found')
  }
  users.delete(req.params.userId)
  res.status(204).send()
}
