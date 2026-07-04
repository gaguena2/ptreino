import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string | null;
  description: string;
}

const MUSCLE_GROUP_BADGE: Record<string, string> = {
  Peito: 'primary',
  Costas: 'success',
  Ombros: 'warning',
  Bíceps: 'info',
  Tríceps: 'danger',
  Abdômen: 'secondary',
  Pernas: 'dark',
};

export function ExercisesPage() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Exercise[]>('/exercises')
      .then((res) => setExercises(res.data))
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const muscleGroups = [...new Set(exercises.map((e) => e.muscleGroup))].sort();

  const filtered = exercises.filter((e) => {
    const matchGroup = filter ? e.muscleGroup === filter : true;
    const matchSearch = search
      ? e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.muscleGroup.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchGroup && matchSearch;
  });

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav
        className="navbar px-3 px-md-4 shadow-sm"
        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)' }}
      >
        <span
          className="navbar-brand text-white fw-bold fs-4 mb-0"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          PTreino
        </span>
        <span className="text-white-50 small">Catálogo de Exercícios</span>
      </nav>

      <div className="container py-4" style={{ maxWidth: 900 }}>
        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 mb-4">
          <div>
            <h5 className="fw-bold mb-0">Exercícios</h5>
            <small className="text-muted">{filtered.length} encontrados</small>
          </div>
          <button
            className="btn btn-primary btn-sm px-3"
            style={{ backgroundColor: '#6366f1', borderColor: '#6366f1' }}
            onClick={() => navigate('/')}
          >
            ← Voltar
          </button>
        </div>

        {/* Filtros */}
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-sm-5">
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Buscar exercício..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-12 col-sm-7">
              <div className="d-flex flex-wrap gap-2">
                <button
                  className={`btn btn-sm ${filter === '' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  style={filter === '' ? { backgroundColor: '#6366f1', borderColor: '#6366f1' } : {}}
                  onClick={() => setFilter('')}
                >
                  Todos
                </button>
                {muscleGroups.map((g) => (
                  <button
                    key={g}
                    className={`btn btn-sm ${filter === g ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={filter === g ? { backgroundColor: '#6366f1', borderColor: '#6366f1' } : {}}
                    onClick={() => setFilter(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">Nenhum exercício encontrado.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4" style={{ width: '35%' }}>Exercício</th>
                    <th style={{ width: '18%' }}>Grupo Muscular</th>
                    <th style={{ width: '18%' }}>Equipamento</th>
                    <th style={{ width: '29%' }}>Instruções</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ex) => {
                    const steps = ex.description.split(' | ');
                    const isOpen = expanded === ex.id;
                    return (
                      <tr key={ex.id}>
                        <td className="ps-4 fw-medium">{ex.name}</td>
                        <td>
                          <span
                            className={`badge rounded-pill bg-${MUSCLE_GROUP_BADGE[ex.muscleGroup] ?? 'secondary'}`}
                          >
                            {ex.muscleGroup}
                          </span>
                        </td>
                        <td className="text-muted small">{ex.equipment ?? '—'}</td>
                        <td>
                          <button
                            className="btn btn-link btn-sm p-0 text-primary text-decoration-none"
                            onClick={() => setExpanded(isOpen ? null : ex.id)}
                          >
                            {isOpen ? 'Ocultar ▲' : 'Ver instruções ▼'}
                          </button>
                          {isOpen && (
                            <ol className="mt-2 mb-0 ps-3 small text-muted">
                              {steps.map((s, i) => (
                                <li key={i} className="mb-1">{s}</li>
                              ))}
                            </ol>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

