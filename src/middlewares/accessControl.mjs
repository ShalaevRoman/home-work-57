export function extractUserRoleMiddleware(req, res, next) {
  req.userRole = req.headers['x-user-role'] || 'viewer'
  next()
}
