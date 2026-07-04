import { z } from 'zod';

export const ACTIVITY_LEVELS = [
  'sedentary',
  'lightly_active',
  'moderately_active',
  'very_active',
  'extremely_active',
] as const;

export const GOALS = ['weight_loss', 'hypertrophy', 'maintenance'] as const;

export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number];
export type Goal = (typeof GOALS)[number];

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nome deve ter pelo menos 3 caracteres')
      .max(80, 'Nome muito longo'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
    age: z
      .string()
      .min(1, 'Informe sua idade')
      .refine((v) => {
        const n = Number(v);
        return Number.isInteger(n) && n >= 10 && n <= 100;
      }, 'Idade deve ser entre 10 e 100'),
    sex: z.enum(['male', 'female', 'other'], {
      errorMap: () => ({ message: 'Selecione um sexo' }),
    }),
    weight: z
      .string()
      .min(1, 'Informe seu peso')
      .refine((v) => {
        const n = Number(v);
        return !isNaN(n) && n > 0 && n < 500;
      }, 'Peso inválido'),
    height: z
      .string()
      .min(1, 'Informe sua altura')
      .refine((v) => {
        const n = Number(v);
        return !isNaN(n) && n > 0 && n < 300;
      }, 'Altura inválida'),
    activityLevel: z.enum(ACTIVITY_LEVELS, {
      errorMap: () => ({ message: 'Selecione seu nível de atividade' }),
    }),
    goal: z.enum(GOALS, {
      errorMap: () => ({ message: 'Selecione seu objetivo' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
