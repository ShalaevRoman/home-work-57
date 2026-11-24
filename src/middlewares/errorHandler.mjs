export function notFoundHandler(req, res) {
  res.status(404).send('Not Found')
}

export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).send('Bad Request')
  }
  console.error(err.stack)
  res.status(500).send('Internal Server Error')
}
