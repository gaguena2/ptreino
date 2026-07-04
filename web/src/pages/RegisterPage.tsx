import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FormField } from '../components/ui/FormField';
import { OptionSelector } from '../components/ui/OptionSelector';
import { SexSelector } from '../components/ui/SexSelector';
import { api } from '../services/api';
import {
  type ActivityLevel,
  type Goal,
  type RegisterFormData,
  registerSchema,
} from '../schemas/register';

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'sedentary', label: 'Sedentário', description: 'Pouco ou nenhum exercício' },
  { value: 'lightly_active', label: 'Levemente ativo', description: 'Exercício leve 1–3 dias/semana' },
  { value: 'moderately_active', label: 'Moderadamente ativo', description: 'Exercício moderado 3–5 dias/semana' },
  { value: 'very_active', label: 'Muito ativo', description: 'Exercício intenso 6–7 dias/semana' },
  { value: 'extremely_active', label: 'Extremamente ativo', description: 'Treino pesado diário ou trabalho físico' },
];

const GOAL_OPTIONS: { value: Goal; label: string; description: string }[] = [
  { value: 'weight_loss', label: 'Emagrecimento', description: 'Reduzir gordura com déficit calórico' },
  { value: 'hypertrophy', label: 'Hipertrofia', description: 'Ganhar massa com superávit calórico' },
  { value: 'maintenance', label: 'Manutenção / Estética', description: 'Manter peso e melhorar composição' },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
      {children}
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterFormData) {
    try {
      const { confirmPassword, age, weight, height, ...rest } = data;
      const payload = {
        ...rest,
        age: parseInt(age, 10),
        weight: parseFloat(weight),
        height: parseFloat(height),
      };
      const res = await api.post('/auth/register', payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err: any) {
      setError('root', {
        message: err.response?.data?.error ?? 'Erro ao cadastrar',
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">PTreino</h1>
          <p className="text-gray-500 text-sm mt-1">
            Preencha seus dados para calcularmos seu plano ideal
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

          {/* Dados pessoais */}
          <Card>
            <SectionTitle>Dados pessoais</SectionTitle>

            <FormField
              label="Nome completo"
              placeholder="Seu nome"
              autoComplete="name"
              error={errors.name?.message}
              {...register('name')}
            />
            <FormField
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <FormField
                label="Idade"
                type="number"
                placeholder="25"
                inputMode="numeric"
                error={errors.age?.message}
                {...register('age')}
              />
              <FormField
                label="Peso (kg)"
                type="number"
                placeholder="70"
                inputMode="decimal"
                error={errors.weight?.message}
                {...register('weight')}
              />
              <FormField
                label="Altura (cm)"
                type="number"
                placeholder="175"
                inputMode="numeric"
                error={errors.height?.message}
                {...register('height')}
              />
            </div>

            <Controller
              control={control}
              name="sex"
              render={({ field }) => (
                <SexSelector
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={errors.sex?.message}
                />
              )}
            />
          </Card>

          {/* Nível de atividade */}
          <Card>
            <SectionTitle>Nível de atividade física</SectionTitle>
            <Controller
              control={control}
              name="activityLevel"
              render={({ field }) => (
                <OptionSelector<ActivityLevel>
                  options={ACTIVITY_OPTIONS}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={errors.activityLevel?.message}
                />
              )}
            />
          </Card>

          {/* Objetivo */}
          <Card>
            <SectionTitle>Objetivo principal</SectionTitle>
            <Controller
              control={control}
              name="goal"
              render={({ field }) => (
                <OptionSelector<Goal>
                  options={GOAL_OPTIONS}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={errors.goal?.message}
                />
              )}
            />
          </Card>

          {/* Segurança */}
          <Card>
            <SectionTitle>Segurança</SectionTitle>
            <FormField
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <FormField
              label="Confirmar senha"
              type="password"
              placeholder="Repita a senha"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </Card>

          {errors.root && (
            <p className="text-sm text-red-500 text-center">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition text-base"
          >
            {isSubmitting ? 'Criando conta…' : 'Criar conta'}
          </button>

          <p className="text-center text-sm text-gray-500 pb-8">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
