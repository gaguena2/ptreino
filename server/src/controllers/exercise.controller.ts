import type { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export async function listExercises(req: Request, res: Response) {
  const { muscleGroup } = req.query;

  const exercises = await prisma.exercise.findMany({
    where: muscleGroup ? { muscleGroup: String(muscleGroup) } : undefined,
    orderBy: [{ muscleGroup: 'asc' }, { name: 'asc' }],
  });

  res.json(exercises);
}

export async function getExercise(req: Request, res: Response) {
  const exercise = await prisma.exercise.findUnique({
    where: { id: String(req.params.id) },
  });

  if (!exercise) {
    res.status(404).json({ error: 'Exercício não encontrado' });
    return;
  }

  res.json(exercise);
}
