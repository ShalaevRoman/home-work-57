import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.mjs'
import { validateUserMiddleware } from '../middlewares/validation.mjs'
import * as usersController from '../controllers/usersController.mjs'

const router = Router()

router.get('/', authMiddleware, usersController.getUsers)
router.post('/', authMiddleware, validateUserMiddleware, usersController.createUser)
router.get('/:userId', authMiddleware, usersController.getUserById)
router.put('/:userId', authMiddleware, validateUserMiddleware, usersController.updateUser)
router.delete('/:userId', authMiddleware, usersController.deleteUser)

export default router
