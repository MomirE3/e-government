export enum ParticipantStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export type Question = {
  id: number;
  text: string;
  type: string;
  required: boolean;
  surveyId: number;
};

export type Survey = {
  id: number;
  title: string;
  description?: string;
  period: string;
  status: string;
  questions: Question[];
};

export type Participant = {
  id: number;
  contact: string;
  token: string;
  status: ParticipantStatus;
  surveyId: number;
  survey?: Survey;
};
