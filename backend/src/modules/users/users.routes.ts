import { Router } from 'express'
import { requireAuth, requireRole } from '../../middlewares/auth.middleware'
import { validateBody } from '../../middlewares/validate.middleware'
import { createUserSchema, updateUserSchema } from './users.schema'
import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  listUsersHandler,
  updateUserHandler,
} from './users.controller'

const router = Router()

router.use(requireAuth, requireRole('admin'))

router.get('/', listUsersHandler)
router.get('/:id', getUserHandler)
router.post('/', validateBody(createUserSchema), createUserHandler)
router.put('/:id', validateBody(updateUserSchema), updateUserHandler)
router.delete('/:id', deleteUserHandler)

export default router
