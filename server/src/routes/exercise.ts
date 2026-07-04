import { Router } from 'express';
import { getExercise, listExercises } from '../controllers/exercise.controller';
import { authMiddleware } from '../middlewares/auth';

export const exerciseRoutes = Router();

exerciseRoutes.use(authMiddleware);

exerciseRoutes.get('/', listExercises);
exerciseRoutes.get('/:id', getExercise);
