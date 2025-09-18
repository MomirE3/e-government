export interface User {
	id: string;
	jmbg: string;
	firstName: string;
	lastName: string;
	email: string;
	role: 'ADMIN' | 'CITIZEN';
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	jmbg: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	password: string;
}

export interface AuthResponse {
	access_token: string;
	user: User;
}

export interface RegisterResponse {
	message: string;
}

export interface AuthContextType {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (credentials: LoginRequest) => Promise<void>;
	register: (data: RegisterRequest) => Promise<void>;
	logout: () => void;
}

export interface ApiError {
	message: string;
	statusCode: number;
	error?: string;
}
