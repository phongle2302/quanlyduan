import { Router } from 'express'
import authRoutes from '../modules/auth/auth.routes'
import contractsRoutes from '../modules/contracts/contracts.routes'
import loansRoutes from '../modules/loans/loans.routes'
import readersRoutes from '../modules/readers/readers.routes'
import booksRoutes from '../modules/books/books.routes'
import usersRoutes from '../modules/users/users.routes'
import dashboardRoutes from '../modules/dashboard/dashboard.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/contracts', contractsRoutes)
router.use('/loans', loansRoutes)
router.use('/readers', readersRoutes)
router.use('/books', booksRoutes)
router.use('/users', usersRoutes)
router.use('/dashboard', dashboardRoutes)

export default router
