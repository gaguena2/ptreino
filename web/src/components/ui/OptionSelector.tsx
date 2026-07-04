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
    <div className="flex flex-col gap-2 mb-4">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-3 p-3 rounded-lg border text-left transition ${
              selected
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 bg-white hover:border-indigo-300'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selected ? 'border-indigo-600' : 'border-gray-300'
              }`}
            >
              {selected && (
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
              )}
            </span>
            <span className="flex flex-col">
              <span
                className={`text-sm font-medium ${
                  selected ? 'text-indigo-700' : 'text-gray-800'
                }`}
              >
                {opt.label}
              </span>
              {opt.description && (
                <span className="text-xs text-gray-500">{opt.description}</span>
              )}
            </span>
          </button>
        );
      })}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
