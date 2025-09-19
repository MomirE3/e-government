import { apiClient } from './axios';

export interface CreateRequestData {
	caseNumber: string;
	type: string;
	status: string;
	submissionDate: string;
	citizenId: string;
	appointment?: {
		dateTime: string;
		location: string;
	};
	payment?: {
		amount: number;
		referenceNumber: string;
	};
	document?: {
		name: string;
		type: string;
		issuedDate: string;
	};
}

export const requestApi = {
	// Create a new request with all related data
	createRequest: async (data: CreateRequestData) => {
		const response = await apiClient.post('/mup/request', data);
		return response.data;
	},

	// Get all requests for current user
	getRequests: async () => {
		const response = await apiClient.get('/mup/request');
		return response.data;
	},

	// Get requests by citizen ID
	getRequestsByCitizenId: async (citizenId: string) => {
		const response = await apiClient.get(`/mup/request/citizen/${citizenId}`);
		return response.data;
	},

	// Get single request by ID
	getRequest: async (id: string) => {
		const response = await apiClient.get(`/mup/request/${id}`);
		return response.data;
	},

	// Update request status
	updateRequest: async (id: string, status: string) => {
		const response = await apiClient.put(`/mup/request/${id}`, { status });
		return response.data;
	},

	// Delete request
	deleteRequest: async (id: string) => {
		const response = await apiClient.delete(`/mup/request/${id}`);
		return response.data;
	},
};
