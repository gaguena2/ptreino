import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth';
import { prisma } from '../utils/prisma';

export async function getMe(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, age: true, sex: true, weight: true, height: true, createdAt: true },
  });

  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }

  res.json(user);
}
