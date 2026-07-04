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
    <div className="min-vh-100 bg-light py-4 px-3">
      <div className="mx-auto" style={{ maxWidth: 540 }}>

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="fw-bold text-primary">PTreino</h1>
          <p className="text-muted small">Preencha seus dados para calcularmos seu plano ideal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* Dados pessoais */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
            <p className="section-label">Dados pessoais</p>

            <FormField label="Nome completo" placeholder="Seu nome" autoComplete="name"
              error={errors.name?.message} {...register('name')} />
            <FormField label="E-mail" type="email" placeholder="seu@email.com" autoComplete="email"
              error={errors.email?.message} {...register('email')} />

            <div className="row g-2 mb-1">
              <div className="col-4">
                <FormField label="Idade" type="number" placeholder="25" inputMode="numeric"
                  error={errors.age?.message} {...register('age')} />
              </div>
              <div className="col-4">
                <FormField label="Peso (kg)" type="number" placeholder="70" inputMode="decimal"
                  error={errors.weight?.message} {...register('weight')} />
              </div>
              <div className="col-4">
                <FormField label="Altura (cm)" type="number" placeholder="175" inputMode="numeric"
                  error={errors.height?.message} {...register('height')} />
              </div>
            </div>

            <Controller
              control={control}
              name="sex"
              render={({ field }) => (
                <SexSelector value={field.value ?? ''} onChange={field.onChange} error={errors.sex?.message} />
              )}
            />
          </div>

          {/* Nível de atividade */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
            <p className="section-label">Nível de atividade física</p>
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
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
            <p className="section-label">Objetivo principal</p>
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
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
            <p className="section-label">Segurança</p>
            <FormField label="Senha" type="password" placeholder="Mínimo 6 caracteres" autoComplete="new-password"
              error={errors.password?.message} {...register('password')} />
            <FormField label="Confirmar senha" type="password" placeholder="Repita a senha" autoComplete="new-password"
              error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          </div>

          {errors.root && (
            <div className="alert alert-danger small text-center py-2">{errors.root.message}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-100 py-2 fw-semibold rounded-3 mb-3"
            style={{ backgroundColor: '#6366f1', borderColor: '#6366f1' }}
          >
            {isSubmitting ? (
              <><span className="spinner-border spinner-border-sm me-2" />Criando conta…</>
            ) : 'Criar conta'}
          </button>

          <p className="text-center text-muted small pb-4">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary fw-bold text-decoration-none">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
