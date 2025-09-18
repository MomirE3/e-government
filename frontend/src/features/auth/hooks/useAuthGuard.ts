import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useAuthGuard = (requireAuth: boolean = true) => {
	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (isLoading) return;

		if (requireAuth && !isAuthenticated) {
			// Redirect to login with return URL
			navigate('/auth/login', {
				state: { from: location.pathname },
				replace: true,
			});
		} else if (!requireAuth && isAuthenticated) {
			// Redirect authenticated users away from auth pages
			const from = (location.state as { from?: string })?.from || '/';
			navigate(from, { replace: true });
		}
	}, [isAuthenticated, isLoading, requireAuth, navigate, location]);

	return { isAuthenticated, isLoading };
};

export const useRoleGuard = (allowedRoles: Array<'ADMIN' | 'CITIZEN'>) => {
	const { user, isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoading) return;

		if (!isAuthenticated) {
			navigate('/auth/login', { replace: true });
			return;
		}

		if (user && !allowedRoles.includes(user.role)) {
			navigate('/unauthorized', { replace: true });
		}
	}, [user, isAuthenticated, isLoading, allowedRoles, navigate]);

	const hasAccess = user ? allowedRoles.includes(user.role) : false;

	return { hasAccess, isLoading, user };
};
