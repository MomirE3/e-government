// Pages
export { LoginPage } from './pages/login';
export { RegistrationPage } from './pages/registration';

// Providers
export { AuthProvider } from './providers/AuthProvider';
export { useAuth } from './hooks/useAuth';

// Hooks
export {
	useLoginMutation,
	useRegisterMutation,
	useLogoutMutation,
	useProfileQuery,
} from './hooks/useAuthQueries';
export { useLoginForm, useRegisterForm } from './hooks/useAuthForm';
export { useAuthGuard, useRoleGuard } from './hooks/useAuthGuard';

// Types
export type {
	User,
	LoginRequest,
	RegisterRequest,
	AuthResponse,
	RegisterResponse,
	AuthContextType,
} from './types/auth.types';

// Schemas
export { loginSchema, registerSchema } from './schemas/auth.schemas';
export type { LoginFormData, RegisterFormData } from './schemas/auth.schemas';
