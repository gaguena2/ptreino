type SexOption = 'male' | 'female' | 'other';

const options: { value: SexOption; label: string }[] = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Feminino' },
  { value: 'other', label: 'Outro' },
];

interface SexSelectorProps {
  value: SexOption | '';
  onChange: (value: SexOption) => void;
  error?: string;
}

export function SexSelector({ value, onChange, error }: SexSelectorProps) {
  return (
    <div className="mb-3">
      <label className="form-label fw-medium small">Sexo biológico</label>
      <div className="d-flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`sex-btn ${value === opt.value ? 'selected' : ''}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}
