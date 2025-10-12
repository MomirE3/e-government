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
	period: string;
	status: 'ACTIVE' | 'INACTIVE';
	questions: Question[];
	participants?: Participant[];
	answers?: Answer[];
}

export interface CreateSurveyData {
	title: string;
	description: string;
	period: string;
	status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateSurveyData {
	title?: string;
	description?: string;
	period?: string;
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

	// Update survey status
	updateSurveyStatus: async (id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<Survey> => {
		const response = await apiClient.patch(`/zavod/surway/${id}/status`, { status });
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

	// Create question for survey
	createQuestion: async (
		surveyId: string,
		data: { text: string; type: string; required: boolean }
	): Promise<Question> => {
		const response = await apiClient.post(
			`/zavod/surway/${surveyId}/questions`,
			data
		);
		return response.data;
	},

	// Update question
	updateQuestion: async (
		questionId: string,
		data: { text: string; type: string; required: boolean }
	): Promise<Question> => {
		const response = await apiClient.put(`/zavod/questions/${questionId}`, data);
		return response.data;
	},

	// Delete question
	deleteQuestion: async (questionId: string): Promise<void> => {
		await apiClient.delete(`/zavod/questions/${questionId}`);
	},

	// Create multiple questions for survey
	createQuestions: async (
		surveyId: string,
		questions: Omit<Question, 'id'>[]
	): Promise<Question[]> => {
		const promises = questions.map(question => 
			surveyApi.createQuestion(surveyId, {
				text: question.text,
				type: question.type,
				required: question.required
			})
		);
		return Promise.all(promises);
	},

	// Create participant for survey
	createParticipant: async (
		surveyId: string,
		data: { contact: string }
	): Promise<Participant> => {
		const response = await apiClient.post(
			`/zavod/surway/${surveyId}/participants`,
			data
		);
		return response.data;
	},

	// Create sample for survey
	createSample: async (
		surveyId: string,
		data: { size: number; criteria: string }
	): Promise<{ id: string; size: number; criteria: string }> => {
		const response = await apiClient.post(
			`/zavod/surway/${surveyId}/sample`,
			data
		);
		return response.data;
	},

	// Create DUI report
	createDUIReport: async (data: { year: number }): Promise<{ id: string; year: number }> => {
		const response = await apiClient.post('/zavod/reports/dui', data);
		return response.data;
	},

	// Create docs report
	createDocsReport: async (data: { periodFrom: string; periodTo: string; title: string }): Promise<{ id: string; title: string; periodFrom: string; periodTo: string }> => {
		const response = await apiClient.post('/zavod/reports/docs', data);
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
