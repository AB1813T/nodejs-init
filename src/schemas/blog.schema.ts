import { z, ZodTypeAny } from 'zod';
import { registry } from '../docs/openapi';

export const blogSchema = registry.register(
  'Blog',
  z.object({
    id: z.string().uuid(),
    title: z.string(),
    content: z.string(),
    authorId: z.string().uuid(),
    createdAt: z.string().datetime().describe('ISO timestamp the blog was created'),
    updatedAt: z.string().datetime().describe('ISO timestamp the blog was last updated'),
  })
);

export const blogListSchema = registry.register('BlogList', z.array(blogSchema));