import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormData, registerSchema } from '../types/authSchemas';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/Types';

type RegisterScreenNavProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;



export default function RegisterScreen() {
    
    const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });
    const register = useAuthStore((state) => state.register); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const navigation = useNavigation<RegisterScreenNavProp>(); 

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
            {/* name */}
            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="Name"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="none"
                    />
                )}
            />
            {errors.name && <Text style={{ color: 'red' }}>{errors.name.message}</Text>}
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
            {/* Server error check and submit button */}
            {serverError && <Text style={{ color: 'red' }}>{serverError}</Text>}
            <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
                <Text>{isSubmitting ? 'registering...' : 'Register'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text>Already have an account? Login </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}