import { asyncHandler } from '@/core/response/responseHandler';
import { OkResponse, CreatedResponse } from '@/core/response/ApiResponse';
import { NotFoundError, ValidationError } from '@/core/errors/ApiError';
import { validateSchema } from '@/core/utils/validateSchema';
import { isAuth } from '@/core/middlewares/isAuth';
import { CreatePlayerProfileSchema, UpdatePlayerProfileSchema } from './player.type';
import * as playerService from './player.service';

export const listPlayersHandler = asyncHandler(async (req, res) => {
  const { game, rank, role } = req.query as { game?: string; rank?: string; role?: string };

  const players = await playerService.listPlayers({ game, rank, role });
  new OkResponse(players).send(res);
});

export const getPlayerProfile = asyncHandler(async (req, res) => {
  const id = req.params.id as string;

  const player = await playerService.getPlayerById(id);
  if (!player) {
    throw new NotFoundError('Player not found');
  }

  new OkResponse(player).send(res);
});

export const createPlayerProfile = asyncHandler(async (req, res) => {
  isAuth(req);

  const data = validateSchema(CreatePlayerProfileSchema, req.body);

  // Check if player profile already exists
  const existing = await playerService.getPlayerByUserId(req.user.id);
  if (existing) {
    throw new ValidationError('Player profile already exists');
  }

  await playerService.createPlayer(req.user.id, data);
  new CreatedResponse('Player profile created').send(res);
});

export const updatePlayerProfile = asyncHandler(async (req, res) => {
  isAuth(req);

  const data = validateSchema(UpdatePlayerProfileSchema, req.body);

  // Check if player profile exists
  const existing = await playerService.getPlayerByUserId(req.user.id);
  if (!existing) {
    throw new NotFoundError('Player profile not found. Create one first.');
  }

  const player = await playerService.updatePlayer(req.user.id, data);
  new OkResponse(player).send(res);
});
