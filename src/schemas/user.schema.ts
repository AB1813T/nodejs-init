import { z, ZodTypeAny } from 'zod';
import { registry } from '../docs/openapi';
export const userSchema = registry.register(
  'User',
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);

export const userListSchema = registry.register('UserList', z.array(userSchema));