import { apiClient } from './axios';

export interface Address {
	id: string;
	street: string;
	number: string;
	city: string;
	postalCode: string;
	country: string;
	validFrom: string;
}

export interface Citizen {
	id: string;
	jmbg: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	role: string;
	address?: Address;
}

export interface UpdateCitizenData {
	id: string;
	jmbg: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: Address;
}

export const citizenApi = {
	// Get citizen by ID
	getCitizen: async (id: string): Promise<Citizen> => {
		const response = await apiClient.get(`/mup/citizens/${id}`);
		return response.data;
	},

	// Update citizen
	updateCitizen: async (
		id: string,
		data: UpdateCitizenData
	): Promise<Citizen> => {
		const response = await apiClient.put(`/mup/citizens/${id}`, data);
		return response.data;
	},

	// Get all citizens (admin only)
	getAllCitizens: async (): Promise<Citizen[]> => {
		const response = await apiClient.get('/mup/citizens');
		return response.data;
	},

	// Create new citizen (admin only)
	createCitizen: async (
		data: Omit<UpdateCitizenData, 'id'>
	): Promise<Citizen> => {
		const response = await apiClient.post('/mup/citizens', data);
		return response.data;
	},

	// Delete citizen (admin only)
	deleteCitizen: async (id: string): Promise<void> => {
		await apiClient.delete(`/mup/citizens/${id}`);
	},
};
