interface Option<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface OptionSelectorProps<T extends string> {
  options: Option<T>[];
  value: T | '';
  onChange: (value: T) => void;
  error?: string;
}

export function OptionSelector<T extends string>({
  options,
  value,
  onChange,
  error,
}: OptionSelectorProps<T>) {
  return (
    <div>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <div
            key={opt.value}
            className={`option-card ${selected ? 'selected' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            <div className="radio-circle">
              {selected && <div className="radio-dot" />}
            </div>
            <div>
              <div className={`fw-medium small ${selected ? 'text-primary' : ''}`}>
                {opt.label}
              </div>
              {opt.description && (
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                  {opt.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}
