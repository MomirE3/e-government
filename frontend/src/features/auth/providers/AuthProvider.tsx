import React, { useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
	User,
	LoginRequest,
	RegisterRequest,
	AuthContextType,
} from '../types/auth.types';
import { authApi, AuthApiError } from '../api/auth.api';
import { message } from 'antd';
import { AuthContext } from '../contexts/AuthContext';

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

type AuthAction =
	| { type: 'SET_LOADING'; payload: boolean }
	| { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
	| { type: 'LOGOUT' }
	| { type: 'SET_USER'; payload: User };

const initialState: AuthState = {
	user: null,
	token: null,
	isAuthenticated: false,
	isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
	switch (action.type) {
		case 'SET_LOADING':
			return { ...state, isLoading: action.payload };

		case 'LOGIN_SUCCESS':
			return {
				...state,
				user: action.payload.user,
				token: action.payload.token,
				isAuthenticated: true,
				isLoading: false,
			};

		case 'LOGOUT':
			return {
				...state,
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
			};

		case 'SET_USER':
			return {
				...state,
				user: action.payload,
				isAuthenticated: true,
				isLoading: false,
			};

		default:
			return state;
	}
};

const TOKEN_KEY = 'e_government_token';

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	// Token storage utilities
	const saveToken = (token: string) => {
		console.log('Saving token to localStorage:', token);
		localStorage.setItem(TOKEN_KEY, token);
		console.log('Token saved successfully');
	};

	const getStoredToken = (): string | null => {
		return localStorage.getItem(TOKEN_KEY);
	};

	const removeToken = () => {
		localStorage.removeItem(TOKEN_KEY);
	};

	// Initialize auth state on app load
	useEffect(() => {
		const initializeAuth = async () => {
			const storedToken = getStoredToken();

			if (!storedToken) {
				dispatch({ type: 'SET_LOADING', payload: false });
				return;
			}

			try {
				const { valid, user } = await authApi.verifyToken(storedToken);

				if (valid && user) {
					dispatch({
						type: 'LOGIN_SUCCESS',
						payload: { user, token: storedToken },
					});
				} else {
					removeToken();
					dispatch({ type: 'LOGOUT' });
				}
			} catch (error) {
				console.error('Token verification failed:', error);
				removeToken();
				dispatch({ type: 'LOGOUT' });
			}
		};

		initializeAuth();
	}, []);

	const login = async (credentials: LoginRequest): Promise<void> => {
		try {
			dispatch({ type: 'SET_LOADING', payload: true });

			const response = await authApi.login(credentials);

			console.log('Login response:', response);
			console.log('Access token:', response.access_token);

			if (!response.access_token) {
				throw new Error('Token nije primljen od servera');
			}

			saveToken(response.access_token);
			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { user: response.user, token: response.access_token },
			});

			message.success(`Dobrodošli, ${response.user.firstName}!`);
		} catch (error) {
			dispatch({ type: 'SET_LOADING', payload: false });

			if (error instanceof AuthApiError) {
				message.error(error.message);
			} else {
				message.error('Dogodila se greška prilikom prijave');
			}

			throw error;
		}
	};

	const register = async (data: RegisterRequest): Promise<void> => {
		try {
			dispatch({ type: 'SET_LOADING', payload: true });

			console.log('Registering user with data:', data);
			const response = await authApi.register(data);
			console.log('Registration response:', response);

			dispatch({ type: 'SET_LOADING', payload: false });

			message.success('Uspešno ste se registrovali! Sada se možete prijaviti.');
		} catch (error) {
			dispatch({ type: 'SET_LOADING', payload: false });

			console.error('Registration error:', error);

			if (error instanceof AuthApiError) {
				message.error(error.message);
			} else {
				message.error('Dogodila se greška prilikom registracije');
			}

			throw error;
		}
	};

	const logout = async (): Promise<void> => {
		try {
			if (state.token) {
				await authApi.logout(state.token);
			}
		} catch (error) {
			console.error('Logout API call failed:', error);
		} finally {
			removeToken();
			dispatch({ type: 'LOGOUT' });
			message.success('Uspešno ste se odjavili');
		}
	};

	const value: AuthContextType = {
		user: state.user,
		token: state.token,
		isAuthenticated: state.isAuthenticated,
		isLoading: state.isLoading,
		login,
		register,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
