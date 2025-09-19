import { apiClient } from './axios';

export interface Question {
	id?: string;
	text: string;
	type: 'TEXT' | 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'RATING';
	options?: string[];
	required: boolean;
}

export interface Participant {
	id: string;
	contact: string;
	createdAt: string;
	updatedAt: string;
}

export interface Answer {
	id: string;
	questionId: string;
	participantId: string;
	answer: string;
	createdAt: string;
	updatedAt: string;
}

export interface Survey {
	id: string;
	title: string;
	description: string;
	status: 'ACTIVE' | 'INACTIVE';
	questions: Question[];
	participants?: Participant[];
	answers?: Answer[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateSurveyData {
	title: string;
	description: string;
	status: 'ACTIVE' | 'INACTIVE';
	questions: Omit<Question, 'id'>[];
}

export interface UpdateSurveyData {
	title?: string;
	description?: string;
	status?: 'ACTIVE' | 'INACTIVE';
	questions?: Omit<Question, 'id'>[];
}

export const surveyApi = {
	// Create new survey
	createSurvey: async (data: CreateSurveyData): Promise<Survey> => {
		const response = await apiClient.post('/zavod/surway', data);
		return response.data;
	},

	// Get all surveys
	getAllSurveys: async (): Promise<Survey[]> => {
		const response = await apiClient.get('/zavod/surway');
		return response.data;
	},

	// Get single survey by ID
	getSurvey: async (id: string): Promise<Survey> => {
		const response = await apiClient.get(`/zavod/surway/${id}`);
		return response.data;
	},

	// Update survey
	updateSurvey: async (id: string, data: UpdateSurveyData): Promise<Survey> => {
		const response = await apiClient.put(`/zavod/surway/${id}`, data);
		return response.data;
	},

	// Delete survey
	deleteSurvey: async (id: string): Promise<void> => {
		await apiClient.delete(`/zavod/surway/${id}`);
	},

	// Get survey participants
	getSurveyParticipants: async (surveyId: string): Promise<Participant[]> => {
		const response = await apiClient.get(
			`/zavod/surway/${surveyId}/participants`
		);
		return response.data;
	},

	// Get survey answers
	getSurveyAnswers: async (surveyId: string): Promise<Answer[]> => {
		const response = await apiClient.get(`/zavod/surway/${surveyId}/answers`);
		return response.data;
	},

	// Generate survey report
	generateSurveyReport: async (
		surveyId: string
	): Promise<{
		survey: Survey;
		participants: Participant[];
		answers: Answer[];
		statistics: {
			totalParticipants: number;
			totalAnswers: number;
			completionRate: number;
		};
	}> => {
		const response = await apiClient.get(`/zavod/surway/${surveyId}/report`);
		return response.data;
	},
};
