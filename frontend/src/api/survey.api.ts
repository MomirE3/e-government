import { apiClient } from './axios';

export interface Question {
	id?: number;
	text: string;
	type: 'TEXT' | 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'RATING';
	options?: string[];
	required: boolean;
}

export interface Participant {
	id: number;
	contact: string;
	createdAt: string;
	updatedAt: string;
}

export interface Answer {
	id: number;
	questionId: number;
	participantId: number;
	value: string;
	createdAt: string;
	updatedAt?: string;
	question?: {
		id: number;
		text: string;
		type: string;
	};
	participant?: {
		id: number;
		contact: string;
		status: string;
	};
}

export interface Survey {
	id: number;
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
	getSurvey: async (id: number): Promise<Survey> => {
		const response = await apiClient.get(`/zavod/surway/${id}`);
		return response.data;
	},

	// Update survey
	updateSurvey: async (id: number, data: UpdateSurveyData): Promise<Survey> => {
		const response = await apiClient.put(`/zavod/surway/${id}`, data);
		return response.data;
	},

	// Update survey status
	updateSurveyStatus: async (id: number, status: 'ACTIVE' | 'INACTIVE'): Promise<Survey> => {
		const response = await apiClient.patch(`/zavod/surway/${id}/status`, { status });
		return response.data;
	},

	// Delete survey
	deleteSurvey: async (id: number): Promise<void> => {
		await apiClient.delete(`/zavod/surway/${id}`);
	},

	// Get survey participants
	getSurveyParticipants: async (surveyId: number): Promise<Participant[]> => {
		const response = await apiClient.get(
			`/zavod/surway/${surveyId}/participants`
		);
		return response.data;
	},

	// Get survey answers
	getSurveyAnswers: async (surveyId: number): Promise<Answer[]> => {
		const response = await apiClient.get(`/zavod/surway/${surveyId}/answers`);
		return response.data;
	},

	// Create question for survey
	createQuestion: async (
		surveyId: number,
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
		questionId: number,
		data: { text: string; type: string; required: boolean }
	): Promise<Question> => {
		const response = await apiClient.put(`/zavod/questions/${questionId}`, data);
		return response.data;
	},

	// Delete question
	deleteQuestion: async (questionId: number): Promise<void> => {
		await apiClient.delete(`/zavod/questions/${questionId}`);
	},

	// Create multiple questions for survey
	createQuestions: async (
		surveyId: number,
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
		surveyId: number,
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
		surveyId: number,
		data: { size: number; criteria: string }
	): Promise<{ id: number; size: number; criteria: string }> => {
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

	// Create survey report
	createSurveyReport: async (data: { surveyId: number; title: string }): Promise<{ id: string; title: string; surveyId: number }> => {
		const response = await apiClient.post('/zavod/reports/survey', data);
		return response.data;
	},

	// Get survey statistics
	getSurveyStatistics: async (surveyId: number): Promise<SurveyStatistics> => {
		const response = await apiClient.get(`/zavod/surveys/${surveyId}/statistics`);
		return response.data;
	},

	// Generate survey report
	generateSurveyReport: async (
		surveyId: number
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

	// Get all reports
	getAllReports: async (): Promise<Report[]> => {
		const response = await apiClient.get('/zavod/reports');
		return response.data;
	},

	// Get report by ID
	getReport: async (id: string): Promise<Report> => {
		const response = await apiClient.get(`/zavod/reports/${id}`);
		return response.data;
	},
};

export interface Report {
	id: string;
	title: string;
	type: string;
	configJSON: string;
	generatedAt: string;
	surveyId?: number;
	duiIndicators?: DUIIndicator[];
	docsIssued?: DocsIssuedIndicator[];
}

export interface DUIIndicator {
	id: number;
	reportId: string;
	year: number;
	municipality: string;
	type: string;
	caseCount: number;
}

export interface DocsIssuedIndicator {
	id: number;
	reportId: string;
	periodFrom: string;
	periodTo: string;
	documentType: string;
	count: number;
}

export interface SurveyStatistics {
	surveyId: number;
	totalParticipants: number;
	totalAnswers: number;
	completionRate: number;
	questionsCount: number;
	responsesByQuestion: Array<{
		questionId: number;
		questionText: string;
		responseCount: number;
		mostCommonAnswer: string;
	}>;
}
