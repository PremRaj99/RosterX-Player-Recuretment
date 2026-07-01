import { swaggerRouter, success } from '@/core/api-docs/swagger.router';
import { RegisterInputSchema, LoginInputSchema } from './auth.type';
import { z } from 'zod';

const authSwagger = swaggerRouter('/auth', ['Authentication']);

authSwagger.post('/register', {
  summary: 'Register a new user',
  body: RegisterInputSchema,
  success: success(201, 'User registered successfully'),
});

authSwagger.post('/login', {
  summary: 'Login a user',
  body: LoginInputSchema,
  success: success(
    200,
    z.object({
      user: z.object({
        id: z.string(),
        email: z.string(),
        username: z.string(),
        displayName: z.string(),
        role: z.enum(['player', 'organizer']),
      }),
      token: z.string(),
    }),
  ),
});
