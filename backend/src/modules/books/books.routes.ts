import { Router } from 'express'
import { requireAuth, requireRole } from '../../middlewares/auth.middleware'
import { validateBody } from '../../middlewares/validate.middleware'
import { createBookSchema, updateBookSchema } from './books.schema'
import {
  createBookHandler,
  deleteBookHandler,
  getBookHandler,
  listBooksHandler,
  updateBookHandler,
} from './books.controller'

const router = Router()

router.use(requireAuth)

router.get('/', listBooksHandler)
router.get('/:id', getBookHandler)
router.post('/', validateBody(createBookSchema), createBookHandler)
router.put('/:id', validateBody(updateBookSchema), updateBookHandler)
router.delete('/:id', requireRole('admin'), deleteBookHandler)

export default router
