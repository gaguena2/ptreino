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
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-sm font-medium text-gray-700">Sexo biológico</label>
      <div className="flex gap-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                selected
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-indigo-400'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
