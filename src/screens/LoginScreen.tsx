import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../types/authSchemas';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/Types';

type LoginScreenNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });
    const login = useAuthStore((state) => state.login);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const navigation = useNavigation<LoginScreenNavProp>();

    const onSubmit = async (data: LoginFormData) => {
        setServerError(null);
        setIsSubmitting(true);
        try {
            await login(data);
        } catch (err) {
            setServerError('Invalid email or password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView>
            {/* email */}
            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="Email"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                )}
            />
            {errors.email && <Text style={{ color: 'red' }}>{errors.email.message}</Text>}
            {/* passowrd */}
            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="Password"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="none"
                        secureTextEntry
                    />
                )}
            />
            {errors.password && <Text style={{ color: 'red' }}>{errors.password.message}</Text>}
            {serverError && <Text style={{ color: 'red' }}>{serverError}</Text>}
            <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
                <Text>{isSubmitting ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text>Don't have an account? Register</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}