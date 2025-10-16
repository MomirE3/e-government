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
		fileUrl?: string;
		fileName?: string;
		fileSize?: number;
		mimeType?: string;
	};
}

export interface Request {
	id: string;
	caseNumber: string;
	type: string;
	status: string;
	submissionDate: string;
	citizenId: string;
	appointment?: {
		id: string;
		dateTime: string;
		location: string;
	};
	payment?: {
		id: string;
		amount: number;
		referenceNumber: string;
	};
	document?: {
		id: string;
		name: string;
		type: string;
		issuedDate: string;
		fileUrl?: string;
		fileName?: string;
		fileSize?: number;
		mimeType?: string;
	};
}

export interface FilterRequestParams {
	citizenId?: string;
	requestStatus?: string;
	requestType?: string;
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

	// Filter requests with parameters
	filterRequests: async (params: FilterRequestParams) => {
		const queryParams = new URLSearchParams();
		if (params.citizenId) queryParams.append('citizenId', params.citizenId);
		if (params.requestStatus)
			queryParams.append('requestStatus', params.requestStatus);
		if (params.requestType)
			queryParams.append('requestType', params.requestType);

		const response = await apiClient.get(
			`/mup/request/filter?${queryParams.toString()}`
		);
		return response.data;
	},

	// Upload document
	uploadDocument: async (formData: FormData) => {
		const response = await apiClient.post('/mup/documents/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	},

	// Get document URL
	getDocumentStream: async (fileUrl: string): Promise<Blob> => {
		const response = await apiClient.get(
			`/mup/documents/stream/${encodeURIComponent(fileUrl)}`,
			{
				responseType: 'blob',
			}
		);
		return response.data;
	},

	// Delete document
	deleteDocumentFile: async (fileUrl: string) => {
		const response = await apiClient.delete(
			`/mup/documents/file/${encodeURIComponent(fileUrl)}`
		);
		return response.data;
	},
};
