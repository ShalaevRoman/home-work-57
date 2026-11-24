import jwt from 'jsonwebtoken'

export const SECRET = 'jwt_secret_key'

export function authMiddleware(req, res, next) {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).send('Unauthorized')
  }
  try {
    req.user = jwt.verify(token, SECRET)
    next()
  } catch {
    res.status(401).send('Unauthorized')
  }
}
