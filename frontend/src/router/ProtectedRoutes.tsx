import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { useAuth } from '../features/auth';
import { AppLayout } from '../components/Layout/AppLayout';
import { Dashboard } from '../pages/Dashboard';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { Request } from '../features/request/Request';
import { Profile } from '../features/profile';
import { MupModule } from '../features/mup';

export const ProtectedRoutes: React.FC = () => {
	const { isAuthenticated, isLoading, user } = useAuth();

	console.log(user);

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
				{/* Common routes */}
				<Route path='/unauthorized' element={<UnauthorizedPage />} />
				<Route path='/profile' element={<Profile />} />

				{/* Admin routes */}
				{user?.role === 'ADMIN' && (
					<>
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/mup' element={<MupModule />} />
						<Route
							path='/zavod/*'
							element={<div>Zavod Module (Admin Only)</div>}
						/>
					</>
				)}

				{/* Citizen routes */}
				{user?.role === 'CITIZEN' && (
					<>
						<Route path='/request' element={<Request />} />
						<Route path='/mup/*' element={<Navigate to='/request' replace />} />
					</>
				)}

				{/* Role-based redirects */}
				<Route
					path='/'
					element={
						user?.role === 'ADMIN' ? (
							<Navigate to='/dashboard' replace />
						) : (
							<Navigate to='/request' replace />
						)
					}
				/>
				<Route
					path='*'
					element={
						user?.role === 'ADMIN' ? (
							<Navigate to='/dashboard' replace />
						) : (
							<Navigate to='/request' replace />
						)
					}
				/>
			</Routes>
		</AppLayout>
	);
};
