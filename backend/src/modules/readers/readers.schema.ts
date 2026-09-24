import { z } from 'zod'

export const readerStatusEnum = z.enum(['active', 'locked', 'expired'])

export const createReaderSchema = z.object({
  code: z.string().min(1).optional(),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  cardExpiry: z.coerce.date(),
  status: readerStatusEnum.default('active'),
})

export const updateReaderSchema = createReaderSchema.partial()

export type CreateReaderInput = z.infer<typeof createReaderSchema>
export type UpdateReaderInput = z.infer<typeof updateReaderSchema>
