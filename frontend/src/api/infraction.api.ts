import { apiClient } from './axios';

export const InfractionType = {
	DRUNK_DRIVING: 'DRUNK_DRIVING',
	SPEEDING: 'SPEEDING',
	RED_LIGHT_VIOLATION: 'RED_LIGHT_VIOLATION',
	NO_SEATBELT: 'NO_SEATBELT',
} as const;

export type InfractionType =
	(typeof InfractionType)[keyof typeof InfractionType];

export interface Infraction {
	id: string;
	dateTime: string;
	municipality: string;
	description: string;
	penaltyPoints: number;
	fine: number;
	type: InfractionType;
	citizenId: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateInfractionData {
	dateTime: string;
	municipality: string;
	description: string;
	penaltyPoints: number;
	fine: number;
	type: InfractionType;
	citizenId: string;
}

export const infractionApi = {
	// Create new infraction
	createInfraction: async (data: CreateInfractionData): Promise<Infraction> => {
		const response = await apiClient.post('/mup/infraction', data);
		return response.data;
	},

	// Get all infractions
	getAllInfractions: async (): Promise<Infraction[]> => {
		const response = await apiClient.get('/mup/infraction');
		return response.data;
	},

	// Get infractions by citizen ID
	getInfractionsByCitizenId: async (
		citizenId: string
	): Promise<Infraction[]> => {
		const response = await apiClient.get(
			`/mup/infraction/citizen/${citizenId}`
		);
		return response.data;
	},

	// Get single infraction by ID
	getInfraction: async (id: string): Promise<Infraction> => {
		const response = await apiClient.get(`/mup/infraction/${id}`);
		return response.data;
	},

	// Update infraction
	updateInfraction: async (
		id: string,
		data: Partial<CreateInfractionData>
	): Promise<Infraction> => {
		const response = await apiClient.put(`/mup/infraction/${id}`, data);
		return response.data;
	},

	// Delete infraction
	deleteInfraction: async (id: string): Promise<void> => {
		await apiClient.delete(`/mup/infraction/${id}`);
	},
};
