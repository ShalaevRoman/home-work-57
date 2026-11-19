export function articleAccessMiddleware(req, res, next) {
  const userRole = req.headers['x-user-role'] || 'viewer'
  req.userRole = userRole
  next()
}
