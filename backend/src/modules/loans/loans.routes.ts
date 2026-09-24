import { Router } from 'express'
import { requireAuth } from '../../middlewares/auth.middleware'
import { validateBody } from '../../middlewares/validate.middleware'
import { createLoanSchema } from './loans.schema'
import { createLoanHandler, getLoanHandler, listLoansHandler, returnLoanHandler } from './loans.controller'

const router = Router()

router.use(requireAuth)

router.get('/', listLoansHandler)
router.get('/:id', getLoanHandler)
router.post('/', validateBody(createLoanSchema), createLoanHandler)
router.post('/:id/return', returnLoanHandler)

export default router
