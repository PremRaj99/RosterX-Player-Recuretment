import { Router } from 'express';
import { verifyJWT } from '@/core/middlewares/verifyJWT';
import { PlayerOnly } from '@/core/middlewares/verifyPlayer';
import {
  listPlayersHandler,
  getPlayerProfile,
  createPlayerProfile,
  updatePlayerProfile,
} from './player.controller';

export const playerRouter = Router();

// Public routes
playerRouter.get('/', listPlayersHandler);
playerRouter.get('/:id', getPlayerProfile);

// Protected routes (player only)
playerRouter.post('/me', verifyJWT, PlayerOnly, createPlayerProfile);
playerRouter.put('/me', verifyJWT, PlayerOnly, updatePlayerProfile);
