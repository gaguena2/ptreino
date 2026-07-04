import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FormField } from '../components/ui/FormField';
import { api } from '../services/api';
import { type LoginFormData, loginSchema } from '../schemas/login';

export function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginFormData) {
    try {
      const res = await api.post('/auth/login', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err: any) {
      setError('root', {
        message: err.response?.data?.error ?? 'Erro ao fazer login',
      });
    }
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center px-3"
      style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)' }}
    >
      <div className="w-100" style={{ maxWidth: 420 }}>

        {/* Logo */}
        <div className="text-center mb-4">
          <h1 className="fw-bold text-white display-5 mb-1">PTreino</h1>
          <p className="text-white-50">Seu parceiro de treinos</p>
        </div>

        {/* Card */}
        <div className="card border-0 shadow-lg rounded-4 p-4">
          <h5 className="fw-bold mb-4">Entrar</h5>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <FormField
              label="Senha"
              type="password"
              placeholder="Sua senha"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="text-end mb-3">
              <button type="button" className="btn btn-link btn-sm p-0 text-primary text-decoration-none">
                Esqueci minha senha
              </button>
            </div>

            {errors.root && (
              <div className="alert alert-danger py-2 text-center small">
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-100 py-2 fw-semibold"
              style={{ backgroundColor: '#6366f1', borderColor: '#6366f1' }}
            >
              {isSubmitting ? (
                <><span className="spinner-border spinner-border-sm me-2" />Entrando…</>
              ) : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-3 text-white-50 small">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-white fw-bold text-decoration-none">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
