import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { useAuth } from '../features/auth';
import { AppLayout } from '../components/Layout/AppLayout';
import { Dashboard } from '../pages/Dashboard';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';

export const ProtectedRoutes: React.FC = () => {
	const { isAuthenticated, isLoading, user } = useAuth();

	if (isLoading) {
		return (
			<Layout style={{ minHeight: '100vh' }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100vh',
					}}
				>
					<Spin size='large' tip='Učitavanje...' />
				</div>
			</Layout>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to='/auth/login' replace />;
	}

	return (
		<AppLayout>
			<Routes>
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/unauthorized' element={<UnauthorizedPage />} />

				{/* MUP routes - available to all authenticated users */}
				<Route path='/mup/*' element={<div>MUP Module (Coming Soon)</div>} />

				{/* Zavod routes - admin only */}
				{user?.role === 'ADMIN' && (
					<Route
						path='/zavod/*'
						element={<div>Zavod Module (Admin Only)</div>}
					/>
				)}

				{/* Profile routes */}
				<Route
					path='/profile'
					element={<div>User Profile (Coming Soon)</div>}
				/>

				{/* Default redirect */}
				<Route path='/' element={<Navigate to='/dashboard' replace />} />
				<Route path='*' element={<Navigate to='/dashboard' replace />} />
			</Routes>
		</AppLayout>
	);
};
