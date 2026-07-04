import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, theme } from '../../constants';

type SexOption = 'male' | 'female' | 'other';

interface SexSelectorProps {
  value: SexOption | '';
  onChange: (value: SexOption) => void;
  error?: string;
}

const options: { value: SexOption; label: string }[] = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Feminino' },
  { value: 'other', label: 'Outro' },
];

export function SexSelector({ value, onChange, error }: SexSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sexo</Text>
      <View style={styles.row}>
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.optionText, selected && styles.optionTextSelected]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: colors.text,
    marginBottom: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  optionTextSelected: {
    color: '#fff',
  },
  error: {
    fontSize: theme.fontSize.xs,
    color: colors.error,
    marginTop: theme.spacing.xs,
  },
});
