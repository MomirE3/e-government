import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RegistrationPage } from '../features/auth';

export const AuthRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path='/login' element={<LoginPage />} />
			<Route path='/register' element={<RegistrationPage />} />
			<Route path='/' element={<Navigate to='/auth/login' replace />} />
			<Route path='*' element={<Navigate to='/auth/login' replace />} />
		</Routes>
	);
};
