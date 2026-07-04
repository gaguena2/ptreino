import type { Request, Response } from 'express';
import { z } from 'zod';
import type { AuthRequest } from '../middlewares/auth';
import { prisma } from '../utils/prisma';

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  exercises: z
    .array(
      z.object({
        exerciseId: z.string().uuid(),
        sets: z.number().int().min(1),
        reps: z.number().int().min(1),
        restSecs: z.number().int().min(0).default(60),
        order: z.number().int().min(0),
      }),
    )
    .optional(),
});

export async function listWorkouts(req: AuthRequest, res: Response) {
  const workouts = await prisma.workout.findMany({
    where: { userId: req.userId },
    include: {
      exercises: { include: { exercise: true }, orderBy: { order: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(workouts);
}

export async function getWorkout(req: Request, res: Response) {
  const workout = await prisma.workout.findUnique({
    where: { id: String(req.params.id) },
    include: {
      exercises: { include: { exercise: true }, orderBy: { order: 'asc' } },
    },
  });

  if (!workout) {
    res.status(404).json({ error: 'Treino não encontrado' });
    return;
  }

  res.json(workout);
}

export async function createWorkout(req: AuthRequest, res: Response) {
  const result = createWorkoutSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const { name, exercises } = result.data;

  const workout = await prisma.workout.create({
    data: {
      name,
      userId: req.userId!,
      exercises: exercises
        ? { create: exercises }
        : undefined,
    },
    include: {
      exercises: { include: { exercise: true }, orderBy: { order: 'asc' } },
    },
  });

  res.status(201).json(workout);
}

export async function deleteWorkout(req: Request, res: Response) {
  await prisma.workout.delete({ where: { id: String(req.params.id) } });
  res.status(204).send();
}
