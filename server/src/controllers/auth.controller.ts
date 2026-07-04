import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { signToken } from '../utils/jwt';
import { calcFitnessProfile } from '../utils/fitness';
import { prisma } from '../utils/prisma';

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  age: z.number().int().min(10).max(100),
  sex: z.enum(['male', 'female', 'other']),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  activityLevel: z.enum([
    'sedentary',
    'lightly_active',
    'moderately_active',
    'very_active',
    'extremely_active',
  ]),
  goal: z.enum(['weight_loss', 'hypertrophy', 'maintenance']),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function register(req: Request, res: Response) {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const { name, email, password, age, sex, weight, height, activityLevel, goal } =
    result.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: 'E-mail já cadastrado' });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, age, sex, weight, height, activityLevel, goal },
    select: {
      id: true,
      name: true,
      email: true,
      age: true,
      sex: true,
      weight: true,
      height: true,
      activityLevel: true,
      goal: true,
    },
  });

  const fitnessProfile =
    weight && height
      ? calcFitnessProfile({ weight, height, age, sex, activityLevel, goal })
      : null;

  const token = signToken({ userId: user.id });
  res.status(201).json({ user, fitnessProfile, token });
}

export async function login(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ error: 'Credenciais inválidas' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: 'Credenciais inválidas' });
    return;
  }

  const fitnessProfile =
    user.weight && user.height
      ? calcFitnessProfile({
          weight: user.weight,
          height: user.height,
          age: user.age,
          sex: user.sex,
          activityLevel: user.activityLevel,
          goal: user.goal,
        })
      : null;

  const token = signToken({ userId: user.id });
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser, fitnessProfile, token });
}
