import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface FitnessProfile {
  tmb: number;
  get: number;
  targetCalories: number;
}

interface User {
  name: string;
  email: string;
  goal: string;
  activityLevel: string;
}

const GOAL_LABELS: Record<string, string> = {
  weight_loss: 'Emagrecimento',
  hypertrophy: 'Hipertrofia',
  maintenance: 'Manutenção',
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Sedentário',
  lightly_active: 'Levemente ativo',
  moderately_active: 'Moderadamente ativo',
  very_active: 'Muito ativo',
  extremely_active: 'Extremamente ativo',
};

export function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [fitness] = useState<FitnessProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    setUser(JSON.parse(stored));

    api.get('/users/me').then((res) => setUser(res.data)).catch(() => {});
  }, [navigate]);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  if (!user) return null;

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar px-3 px-md-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)' }}>
        <span className="navbar-brand text-white fw-bold fs-4 mb-0">PTreino</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white-50 small d-none d-sm-inline">{user.name}</span>
          <button onClick={logout} className="btn btn-sm btn-light btn-outline-light text-white border-white-50 px-3">
            Sair
          </button>
        </div>
      </nav>

      <div className="container py-4" style={{ maxWidth: 720 }}>
        {/* Boas-vindas */}
        <div className="mb-4">
          <h4 className="fw-bold mb-1">Olá, {user.name.split(' ')[0]}! 👋</h4>
          <p className="text-muted small mb-0">Aqui está seu resumo.</p>
        </div>

        {/* Cards objetivo + atividade */}
        <div className="row g-3 mb-3">
          <div className="col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
              <p className="section-label mb-1">Objetivo</p>
              <p className="fw-bold text-primary mb-0">{GOAL_LABELS[user.goal] ?? user.goal}</p>
            </div>
          </div>
          <div className="col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
              <p className="section-label mb-1">Atividade</p>
              <p className="fw-bold text-primary mb-0" style={{ fontSize: '0.9rem' }}>
                {ACTIVITY_LABELS[user.activityLevel] ?? user.activityLevel}
              </p>
            </div>
          </div>
        </div>

        {/* Calorias */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
          <p className="section-label">Estimativa calórica diária</p>
          <div className="row text-center g-2">
            {[
              { label: 'TMB', value: fitness?.tmb, hint: 'em repouso' },
              { label: 'GET', value: fitness?.get, hint: 'gasto total' },
              { label: 'Meta', value: fitness?.targetCalories, hint: 'seu objetivo' },
            ].map(({ label, value, hint }) => (
              <div key={label} className="col-4">
                <div className="fs-4 fw-bold">{value ?? '—'}</div>
                <div className="text-primary fw-semibold small">{label}</div>
                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{hint}</div>
              </div>
            ))}
          </div>
          <p className="text-muted text-center mt-3 mb-0" style={{ fontSize: '0.7rem' }}>
            kcal/dia · fórmula Mifflin-St Jeor
          </p>
        </div>

        {/* Ações rápidas */}
        <div className="row g-3">
          <div className="col-12 col-sm-6">
            <div
              className="card border-0 shadow-sm rounded-4 p-4 text-center h-100"
              style={{ cursor: 'pointer', background: '#eef2ff' }}
              onClick={() => navigate('/exercises')}
            >
              <div className="fs-2 mb-2">🏋️</div>
              <p className="text-primary fw-semibold mb-1">Catálogo de Exercícios</p>
              <p className="text-muted small mb-0">Veja todos os exercícios disponíveis</p>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100" style={{ background: '#f0fdf4' }}>
              <div className="fs-2 mb-2">📅</div>
              <p className="text-success fw-semibold mb-1">Minha Grade de Treinos</p>
              <p className="text-muted small mb-0">Em breve</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
