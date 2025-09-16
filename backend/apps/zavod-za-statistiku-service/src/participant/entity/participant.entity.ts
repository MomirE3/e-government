export enum ParticipantStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export type Participant = {
  id: number;
  contact: string;
  token: string;
  status: ParticipantStatus;
  surveyId: number;
};
