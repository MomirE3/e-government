import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import srRS from 'antd/locale/sr_RS';
import { AuthProvider } from '../features/auth';
import { AuthRoutes } from './AuthRoutes';
import { ProtectedRoutes } from './ProtectedRoutes';

// Create a client for React Query
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 5 * 60 * 1000, // 5 minutes
		},
		mutations: {
			retry: 1,
		},
	},
});

export const AppRouter: React.FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<ConfigProvider locale={srRS}>
				<AuthProvider>
					<BrowserRouter>
						<Routes>
							{/* Auth routes (login, register) */}
							<Route path='/auth/*' element={<AuthRoutes />} />

							{/* Protected routes */}
							<Route path='/*' element={<ProtectedRoutes />} />

							{/* Default redirect */}
							<Route path='/' element={<Navigate to='/dashboard' replace />} />
						</Routes>
					</BrowserRouter>
				</AuthProvider>
			</ConfigProvider>
		</QueryClientProvider>
	);
};
