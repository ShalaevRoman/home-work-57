import { Router } from 'express'
import { articleAccessMiddleware } from '../middlewares/accessControl.mjs'
import { validateArticleMiddleware } from '../middlewares/validation.mjs'
import * as articlesController from '../controllers/articlesController.mjs'

const router = Router()

router.get('/', articleAccessMiddleware, articlesController.getArticles)
router.post('/', articleAccessMiddleware, validateArticleMiddleware, articlesController.createArticle)
router.get('/:articleId', articleAccessMiddleware, articlesController.getArticleById)
router.put('/:articleId', articleAccessMiddleware, validateArticleMiddleware, articlesController.updateArticle)
router.delete('/:articleId', articleAccessMiddleware, articlesController.deleteArticle)

export default router
