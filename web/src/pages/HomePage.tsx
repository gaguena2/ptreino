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

    api.get('/users/me').then((res) => {
      const u = res.data;
      setUser(u);
      if (u.weight && u.height) {
        // recalculate from profile endpoint when available
      }
    }).catch(() => {});
  }, [navigate]);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between shadow">
        <span className="text-2xl font-bold tracking-tight">PTreino</span>
        <div className="flex items-center gap-4">
          <span className="text-indigo-200 text-sm">{user.name}</span>
          <button
            onClick={logout}
            className="text-sm bg-indigo-500 hover:bg-indigo-400 px-3 py-1.5 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Boas-vindas */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Olá, {user.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-500 mt-1">Aqui está seu resumo de hoje.</p>
        </div>

        {/* Cards de info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Objetivo</p>
            <p className="text-lg font-bold text-indigo-600">
              {GOAL_LABELS[user.goal] ?? user.goal}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Atividade</p>
            <p className="text-lg font-bold text-indigo-600">
              {ACTIVITY_LABELS[user.activityLevel] ?? user.activityLevel}
            </p>
          </div>
        </div>

        {/* Calorias — placeholder até ter endpoint */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-4">
            Estimativa calórica diária
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'TMB', value: fitness?.tmb, hint: 'em repouso' },
              { label: 'GET', value: fitness?.get, hint: 'gasto total' },
              { label: 'Meta', value: fitness?.targetCalories, hint: 'seu objetivo' },
            ].map(({ label, value, hint }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-gray-900">
                  {value ?? '—'}
                </span>
                <span className="text-sm font-semibold text-indigo-600">{label}</span>
                <span className="text-xs text-gray-400">{hint}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            kcal/dia · fórmula Mifflin-St Jeor
          </p>
        </div>

        {/* Em breve */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
          <p className="text-indigo-600 font-semibold">Seus treinos aparecerão aqui em breve</p>
          <p className="text-indigo-400 text-sm mt-1">Estamos construindo esta seção</p>
        </div>
      </main>
    </div>
  );
}
