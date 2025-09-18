import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema } from '../schemas/auth.schemas';
import type { LoginFormData, RegisterFormData } from '../schemas/auth.schemas';

export const useLoginForm = () => {
	return useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'onChange',
	});
};

export const useRegisterForm = () => {
	return useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			jmbg: '',
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			password: '',
			confirmPassword: '',
		},
		mode: 'onChange',
	});
};
