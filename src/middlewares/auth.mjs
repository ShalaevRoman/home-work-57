export function authMiddleware(req, res, next) {
  const token = req.headers['x-auth-token']
  req.authenticated = Boolean(token)
  next()
}
