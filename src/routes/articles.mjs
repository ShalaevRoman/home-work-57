import { Router } from 'express'
import { extractUserRoleMiddleware } from '../middlewares/accessControl.mjs'
import { validateArticleMiddleware } from '../middlewares/validation.mjs'
import * as articlesController from '../controllers/articlesController.mjs'

const router = Router()

router.get('/', extractUserRoleMiddleware, articlesController.getArticles)
router.post('/', extractUserRoleMiddleware, validateArticleMiddleware, articlesController.createArticle)
router.get('/:articleId', extractUserRoleMiddleware, articlesController.getArticleById)
router.put('/:articleId', extractUserRoleMiddleware, validateArticleMiddleware, articlesController.updateArticle)
router.delete('/:articleId', extractUserRoleMiddleware, articlesController.deleteArticle)

export default router
