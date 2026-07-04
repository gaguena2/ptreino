import { Router } from 'express';
import { getMe } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth';

export const userRoutes = Router();

userRoutes.get('/me', authMiddleware, getMe);
