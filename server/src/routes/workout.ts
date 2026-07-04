import { Router } from 'express';
import {
  createWorkout,
  deleteWorkout,
  getWorkout,
  listWorkouts,
} from '../controllers/workout.controller';
import { authMiddleware } from '../middlewares/auth';

export const workoutRoutes = Router();

workoutRoutes.use(authMiddleware);

workoutRoutes.get('/', listWorkouts);
workoutRoutes.get('/:id', getWorkout);
workoutRoutes.post('/', createWorkout);
workoutRoutes.delete('/:id', deleteWorkout);
