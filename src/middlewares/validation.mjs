export function validateUserMiddleware(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!req.body) return res.status(400).send('Bad Request')
    const { name } = req.body
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).send('Bad Request')
    }
  }
  next()
}

export function validateArticleMiddleware(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!req.body) return res.status(400).send('Bad Request')
    const { title } = req.body
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).send('Bad Request')
    }
  }
  next()
}
