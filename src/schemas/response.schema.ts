import { z, ZodTypeAny } from 'zod';
import { registry } from '../docs/openapi';
export const messageSchema = registry.register(
  'MessageResponse',
  z.object({
    message: z.string(),
  })
);

export const successResponse = <T extends ZodTypeAny>(schema: T) =>
  z.object({
    success: z.literal(true),
    data: schema,
  });

export const errorResponse = registry.register(
  'ErrorResponse',
  z.object({
    success: z.literal(false),
    error: z.string(),
  })
);