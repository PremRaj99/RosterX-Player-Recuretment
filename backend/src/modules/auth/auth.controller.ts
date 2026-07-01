import jwt from 'jsonwebtoken';
import { asyncHandler } from '@/core/response/responseHandler';
import { validateSchema } from '@/core/utils/validateSchema';
import { CreatedResponse, OkResponse } from '@/core/response/ApiResponse';
import { ValidationError, UnauthorizedError } from '@/core/errors/ApiError';
import { ACCESS_TOKEN_SECRET } from '@/core/constants';
import { RegisterInputSchema, LoginInputSchema } from './auth.type';
import { createUser, findUserByEmail, findUserByUsername, comparePassword } from './auth.service';

export const register = asyncHandler(async (req, res) => {
  const data = validateSchema(RegisterInputSchema, req.body);

  // Check for existing email
  const existingEmail = await findUserByEmail(data.email);
  if (existingEmail) {
    throw new ValidationError('Email already in use');
  }

  // Check for existing username
  const existingUsername = await findUserByUsername(data.username);
  if (existingUsername) {
    throw new ValidationError('Username already taken');
  }

  const user = await createUser(data);

  const token = jwt.sign({ id: user.id, role: user.role }, String(ACCESS_TOKEN_SECRET), {
    expiresIn: '7d',
  });

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  new CreatedResponse('User registered successfully').send(res);
});

export const login = asyncHandler(async (req, res) => {
  const data = validateSchema(LoginInputSchema, req.body);

  const user = await findUserByEmail(data.email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isMatch = await comparePassword(data.password, user.passwordHash);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = jwt.sign({ id: user.id, role: user.role }, String(ACCESS_TOKEN_SECRET), {
    expiresIn: '7d',
  });

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  new OkResponse({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    },
    token,
  }).send(res);
});
