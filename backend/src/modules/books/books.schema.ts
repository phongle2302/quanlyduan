import { z } from 'zod'

export const bookStatusEnum = z.enum(['available', 'borrowed_out', 'liquidated'])

export const createBookSchema = z.object({
  code: z.string().min(1).optional(),
  title: z.string().min(1),
  author: z.string().min(1),
  publisher: z.string().min(1),
  category: z.string().min(1),
  quantity: z.number().int().nonnegative(),
  available: z.number().int().nonnegative(),
  status: bookStatusEnum.default('available'),
})

export const updateBookSchema = createBookSchema.partial()

export type CreateBookInput = z.infer<typeof createBookSchema>
export type UpdateBookInput = z.infer<typeof updateBookSchema>
