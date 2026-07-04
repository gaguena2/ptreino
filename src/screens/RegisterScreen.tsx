import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormField } from '../components/common/FormField';
import { OptionSelector } from '../components/common/OptionSelector';
import { SexSelector } from '../components/common/SexSelector';
import { colors, theme } from '../constants';
import { type RegisterFormData, registerSchema } from '../schemas/register';
import type { ActivityLevel, Goal } from '../schemas/register';
import type { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; description: string }[] = [
  {
    value: 'sedentary',
    label: 'Sedentário',
    description: 'Pouco ou nenhum exercício',
  },
  {
    value: 'lightly_active',
    label: 'Levemente ativo',
    description: 'Exercício leve 1–3 dias por semana',
  },
  {
    value: 'moderately_active',
    label: 'Moderadamente ativo',
    description: 'Exercício moderado 3–5 dias por semana',
  },
  {
    value: 'very_active',
    label: 'Muito ativo',
    description: 'Exercício intenso 6–7 dias por semana',
  },
  {
    value: 'extremely_active',
    label: 'Extremamente ativo',
    description: 'Treino pesado diário ou trabalho físico intenso',
  },
];

const GOAL_OPTIONS: { value: Goal; label: string; description: string }[] = [
  {
    value: 'weight_loss',
    label: 'Emagrecimento',
    description: 'Reduzir gordura corporal com déficit calórico',
  },
  {
    value: 'hypertrophy',
    label: 'Hipertrofia',
    description: 'Ganhar massa muscular com superávit calórico',
  },
  {
    value: 'maintenance',
    label: 'Manutenção / Estética',
    description: 'Manter o peso e melhorar a composição corporal',
  },
];

export function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      sex: undefined,
      weight: '',
      height: '',
      activityLevel: undefined,
      goal: undefined,
    },
  });

  async function onSubmit(data: RegisterFormData) {
    // Substitua pela chamada real à API
    await new Promise((r) => setTimeout(r, 1000));
    Alert.alert('Cadastro realizado!', `Bem-vindo(a), ${data.name}!`, [
      { text: 'Fazer login', onPress: () => navigation.navigate('Login') },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Crie sua conta</Text>
        <Text style={styles.subtitle}>
          Preencha seus dados para calcularmos seu plano ideal
        </Text>

        {/* ── Dados pessoais ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados pessoais</Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <FormField
                label="Nome completo"
                placeholder="Seu nome"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
                maxLength={80}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <FormField
                label="E-mail"
                placeholder="seu@email.com"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                keyboardType="email-address"
              />
            )}
          />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Controller
                control={control}
                name="age"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    label="Idade"
                    placeholder="25"
                    value={value}
                    onChangeText={onChange}
                    error={errors.age?.message}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                )}
              />
            </View>
            <View style={styles.rowItem}>
              <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    label="Peso (kg)"
                    placeholder="70"
                    value={value}
                    onChangeText={onChange}
                    error={errors.weight?.message}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                )}
              />
            </View>
            <View style={styles.rowItem}>
              <Controller
                control={control}
                name="height"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    label="Altura (cm)"
                    placeholder="175"
                    value={value}
                    onChangeText={onChange}
                    error={errors.height?.message}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="sex"
            render={({ field: { onChange, value } }) => (
              <SexSelector
                value={value ?? ''}
                onChange={onChange}
                error={errors.sex?.message}
              />
            )}
          />
        </View>

        {/* ── Nível de atividade ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nível de atividade física</Text>
          <Controller
            control={control}
            name="activityLevel"
            render={({ field: { onChange, value } }) => (
              <OptionSelector<ActivityLevel>
                label=""
                options={ACTIVITY_OPTIONS}
                value={value ?? ''}
                onChange={onChange}
                error={errors.activityLevel?.message}
              />
            )}
          />
        </View>

        {/* ── Objetivo ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objetivo principal</Text>
          <Controller
            control={control}
            name="goal"
            render={({ field: { onChange, value } }) => (
              <OptionSelector<Goal>
                label=""
                options={GOAL_OPTIONS}
                value={value ?? ''}
                onChange={onChange}
                error={errors.goal?.message}
              />
            )}
          />
        </View>

        {/* ── Segurança ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança</Text>

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <FormField
                label="Senha"
                placeholder="Mínimo 6 caracteres"
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                secureTextEntry
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <FormField
                label="Confirmar senha"
                placeholder="Repita a senha"
                value={value}
                onChangeText={onChange}
                error={errors.confirmPassword?.message}
                secureTextEntry
              />
            )}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Criar conta</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  rowItem: {
    flex: 1,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  footerText: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: theme.fontSize.sm,
    color: colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
});
