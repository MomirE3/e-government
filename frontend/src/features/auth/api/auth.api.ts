import type {
	LoginRequest,
	RegisterRequest,
	AuthResponse,
	RegisterResponse,
	User,
	ApiError,
} from '../types/auth.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class AuthApiError extends Error {
	public statusCode: number;
	public error?: string;

	constructor(message: string, statusCode: number, error?: string) {
		super(message);
		this.name = 'AuthApiError';
		this.statusCode = statusCode;
		this.error = error;
	}
}

const handleApiResponse = async <T>(response: Response): Promise<T> => {
	if (!response.ok) {
		const errorData: ApiError = await response.json().catch(() => ({
			message: 'Dogodila se greška',
			statusCode: response.status,
		}));

		throw new AuthApiError(
			errorData.message,
			errorData.statusCode,
			errorData.error
		);
	}

	return response.json();
};

export const authApi = {
	login: async (credentials: LoginRequest): Promise<AuthResponse> => {
		const response = await fetch(`${API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials),
		});

		return handleApiResponse<AuthResponse>(response);
	},

	register: async (data: RegisterRequest): Promise<RegisterResponse> => {
		const response = await fetch(`${API_BASE_URL}/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		return handleApiResponse<RegisterResponse>(response);
	},

	verifyToken: async (
		token: string
	): Promise<{ valid: boolean; user: User }> => {
		const response = await fetch(`${API_BASE_URL}/auth/verify`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		return handleApiResponse<{ valid: boolean; user: User }>(response);
	},

	getProfile: async (token: string): Promise<User> => {
		const response = await fetch(`${API_BASE_URL}/auth/profile`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		return handleApiResponse<User>(response);
	},

	logout: async (token: string): Promise<{ message: string }> => {
		const response = await fetch(`${API_BASE_URL}/auth/logout`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		return handleApiResponse<{ message: string }>(response);
	},
};

// AuthApiError is already exported above
