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
      const { confirmPassword, ...payload } = data;
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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">PTreino</h1>
          <p className="text-gray-500 mt-1">Preencha seus dados para calcularmos seu plano ideal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

          {/* Dados pessoais */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <SectionTitle>Dados pessoais</SectionTitle>

            <FormField label="Nome completo" placeholder="Seu nome" error={errors.name?.message} {...register('name')} />
            <FormField label="E-mail" type="email" placeholder="seu@email.com" error={errors.email?.message} {...register('email')} />

            <div className="grid grid-cols-3 gap-3">
              <FormField label="Idade" type="number" placeholder="25" error={errors.age?.message} {...register('age')} />
              <FormField label="Peso (kg)" type="number" placeholder="70" error={errors.weight?.message} {...register('weight')} />
              <FormField label="Altura (cm)" type="number" placeholder="175" error={errors.height?.message} {...register('height')} />
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
          </div>

          {/* Nível de atividade */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
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
          </div>

          {/* Objetivo */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
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
          </div>

          {/* Segurança */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <SectionTitle>Segurança</SectionTitle>
            <FormField label="Senha" type="password" placeholder="Mínimo 6 caracteres" error={errors.password?.message} {...register('password')} />
            <FormField label="Confirmar senha" type="password" placeholder="Repita a senha" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          </div>

          {errors.root && (
            <p className="text-sm text-red-500 text-center">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
          >
            {isSubmitting ? 'Criando conta…' : 'Criar conta'}
          </button>

          <p className="text-center text-sm text-gray-500">
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
