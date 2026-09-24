import { z } from 'zod'

export const systemRoleEnum = z.enum(['admin', 'librarian'])

export const createUserSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: systemRoleEnum.default('librarian'),
})

export const updateUserSchema = z.object({
  fullName: z.string().min(1).optional(),
  role: systemRoleEnum.optional(),
  active: z.boolean().optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
