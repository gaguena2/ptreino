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
    name: z.string().min(3, 'Mínimo 3 caracteres').max(80),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
    age: z.coerce
      .number({ invalid_type_error: 'Informe sua idade' })
      .int()
      .min(10, 'Idade mínima: 10')
      .max(100, 'Idade máxima: 100'),
    sex: z.enum(['male', 'female', 'other'], {
      errorMap: () => ({ message: 'Selecione um sexo' }),
    }),
    weight: z.coerce
      .number({ invalid_type_error: 'Informe seu peso' })
      .positive('Peso inválido')
      .max(500),
    height: z.coerce
      .number({ invalid_type_error: 'Informe sua altura' })
      .positive('Altura inválida')
      .max(300),
    activityLevel: z.enum(ACTIVITY_LEVELS, {
      errorMap: () => ({ message: 'Selecione seu nível de atividade' }),
    }),
    goal: z.enum(GOALS, {
      errorMap: () => ({ message: 'Selecione seu objetivo' }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
