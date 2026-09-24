import { Router } from 'express'
import { requireAuth, requireRole } from '../../middlewares/auth.middleware'
import { validateBody } from '../../middlewares/validate.middleware'
import { createContractSchema, updateContractSchema } from './contracts.schema'
import {
  createContractHandler,
  deleteContractHandler,
  getContractHandler,
  listContractsHandler,
  updateContractHandler,
} from './contracts.controller'

const router = Router()

router.use(requireAuth)

router.get('/', listContractsHandler)
router.get('/:id', getContractHandler)
router.post('/', validateBody(createContractSchema), createContractHandler)
router.put('/:id', validateBody(updateContractSchema), updateContractHandler)
router.delete('/:id', requireRole('admin'), deleteContractHandler)

export default router
