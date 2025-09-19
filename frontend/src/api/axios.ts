import axios from 'axios';

// Base URL for the backend API
const BASE_URL = 'http://localhost:3000';

// Create axios instance
export const apiClient = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('e_government_token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response?.status === 401) {
			// Unauthorized - clear token and redirect to login
			localStorage.removeItem('token');
			// Use React Router navigation instead of window.location
			// This will be handled by the auth context
		}
		return Promise.reject(error);
	}
);

export default apiClient;
