import { Router } from 'express'
import { validateBody } from '../../middlewares/validate.middleware'
import { loginSchema } from './auth.schema'
import { loginHandler } from './auth.controller'

const router = Router()

router.post('/login', validateBody(loginSchema), loginHandler)

export default router
