import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';
import { useAuth } from './useAuth';

export const useLoginMutation = () => {
	const { login } = useAuth();

	return useMutation({
		mutationFn: (credentials: LoginRequest) => login(credentials),
		onError: (error) => {
			console.error('Login failed:', error);
		},
	});
};

export const useRegisterMutation = () => {
	const { register } = useAuth();

	return useMutation({
		mutationFn: (data: RegisterRequest) => register(data),
		onError: (error) => {
			console.error('Registration failed:', error);
		},
	});
};

export const useLogoutMutation = () => {
	const { logout } = useAuth();

	return useMutation({
		mutationFn: async () => {
			await logout();
		},
		onError: (error) => {
			console.error('Logout failed:', error);
		},
	});
};

export const useProfileQuery = () => {
	const { token, isAuthenticated } = useAuth();

	return useQuery({
		queryKey: ['profile'],
		queryFn: () => authApi.getProfile(token!),
		enabled: isAuthenticated && !!token,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 1,
	});
};

export const useTokenVerification = (token: string | null) => {
	return useQuery({
		queryKey: ['token-verification', token],
		queryFn: () => authApi.verifyToken(token!),
		enabled: !!token,
		retry: false,
		staleTime: 0,
	});
};
