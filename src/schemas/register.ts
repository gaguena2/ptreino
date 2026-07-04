import { z } from 'zod';

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
      .optional()
      .refine((v) => {
        if (!v) return true;
        const n = Number(v);
        return !isNaN(n) && n > 0 && n < 500;
      }, 'Peso inválido'),
    height: z
      .string()
      .optional()
      .refine((v) => {
        if (!v) return true;
        const n = Number(v);
        return !isNaN(n) && n > 0 && n < 300;
      }, 'Altura inválida'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
