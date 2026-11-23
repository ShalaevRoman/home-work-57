import { articles } from '../models/articles.mjs'

export const getArticles = (req, res) => {
  const result = Array.from(articles.entries()).map(([id, data]) => ({ id, ...data }))
  res.render('articles.ejs', { articles: result })
}

export const createArticle = (req, res, next) => {
  try {
    const { title } = req.body
    const id = String(Date.now())
    articles.set(id, { title })
    res.status(201).json({ id, title })
  } catch (err) {
    next(err)
  }
}

export const getArticleById = (req, res) => {
  const article = articles.get(req.params.articleId)
  if (!article) return res.status(404).send('Not Found')
  res.render('article.ejs', { article: { id: req.params.articleId, ...article } })
}

export const updateArticle = (req, res) => {
  const { title } = req.body
  if (!articles.has(req.params.articleId)) {
    return res.status(404).send('Not Found')
  }
  articles.set(req.params.articleId, { title })
  res.json({ id: req.params.articleId, title })
}

export const deleteArticle = (req, res) => {
  if (!articles.has(req.params.articleId)) {
    return res.status(404).send('Not Found')
  }
  articles.delete(req.params.articleId)
  res.status(204).send()
}
