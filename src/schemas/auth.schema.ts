import { z, ZodTypeAny } from 'zod';
import { registry } from '../docs/openapi';
const authUserSchema = registry.register(
  'AuthUser',
  z.object({
    id: z.string().uuid().optional(),
    email: z.string().email().optional(),
  })
);

export const authTokensSchema = registry.register(
  'AuthTokens',
  z.object({
    accessToken: z.string().nullish(),
    refreshToken: z.string().nullish(),
    user: authUserSchema.nullish(),
  })
);