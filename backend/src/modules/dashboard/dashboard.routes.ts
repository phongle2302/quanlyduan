import { Router } from 'express'
import { requireAuth } from '../../middlewares/auth.middleware'
import { getSummaryHandler } from './dashboard.controller'

const router = Router()

router.use(requireAuth)
router.get('/summary', getSummaryHandler)

export default router
