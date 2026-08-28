import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormData, registerSchema } from '../types/authSchemas';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/Types';
import AppHeader from '../components/AppHeader';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../constants/theme';

type RegisterScreenNavProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const register = useAuthStore((state) => state.register);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigation = useNavigation<RegisterScreenNavProp>();
  const theme = useTheme();
  const styles = createStyles(theme);

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await register(data);
    } catch (err) {
      setServerError('An account with this email already exists');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <View style={styles.header}>
            <AppHeader />
            <Text style={styles.eyebrow}>Get started</Text>
            <Text style={styles.title}>Create Account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="Your name"
                    placeholderTextColor={theme.placeholder}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                  />
                )}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="you@example.com"
                    placeholderTextColor={theme.placeholder}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                )}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="••••••••"
                    placeholderTextColor={theme.placeholder}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    secureTextEntry
                  />
                )}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            </View>

            {serverError && <Text style={styles.serverError}>{serverError}</Text>}

            <TouchableOpacity style={[styles.button, isSubmitting && styles.buttonDisabled]} onPress={handleSubmit(onSubmit)} disabled={isSubmitting} activeOpacity={0.85}>
              {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Create Account</Text>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? <Text style={styles.footerLink}>Log In</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    flex: { flex: 1 },
    container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
    header: { marginBottom: 32 },
    eyebrow: { fontSize: 15, color: theme.textSecondary, marginBottom: 2 },
    title: { fontSize: 30, fontWeight: '700', color: theme.text },
    form: { backgroundColor: theme.card, borderRadius: 16, padding: 20 },
    field: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '600', color: theme.labelSecondary, marginBottom: 6 },
    input: { backgroundColor: theme.inputBackground, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: theme.text },
    inputError: { borderWidth: 1, borderColor: theme.danger },
    errorText: { color: theme.danger, fontSize: 12, marginTop: 4 },
    serverError: { color: theme.danger, fontSize: 13, marginBottom: 12, textAlign: 'center' },
    button: { backgroundColor: theme.buttonDark, borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginTop: 4 },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    footer: { marginTop: 24, alignItems: 'center' },
    footerText: { fontSize: 14, color: theme.textSecondary },
    footerLink: { color: theme.text, fontWeight: '600' },
  });
}