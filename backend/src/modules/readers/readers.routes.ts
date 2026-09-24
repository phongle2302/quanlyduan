import { Router } from 'express'
import { requireAuth, requireRole } from '../../middlewares/auth.middleware'
import { validateBody } from '../../middlewares/validate.middleware'
import { createReaderSchema, updateReaderSchema } from './readers.schema'
import {
  createReaderHandler,
  deleteReaderHandler,
  getReaderHandler,
  listReadersHandler,
  updateReaderHandler,
} from './readers.controller'

const router = Router()

router.use(requireAuth)

router.get('/', listReadersHandler)
router.get('/:id', getReaderHandler)
router.post('/', validateBody(createReaderSchema), createReaderHandler)
router.put('/:id', validateBody(updateReaderSchema), updateReaderHandler)
router.delete('/:id', requireRole('admin'), deleteReaderHandler)

export default router
