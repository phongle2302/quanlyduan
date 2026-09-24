import { z } from 'zod'

export const createLoanSchema = z.object({
  code: z.string().min(1).optional(),
  readerId: z.string().min(1),
  bookId: z.string().min(1),
  borrowDate: z.coerce.date(),
  dueDate: z.coerce.date(),
})

export type CreateLoanInput = z.infer<typeof createLoanSchema>
