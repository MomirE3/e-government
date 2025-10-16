export enum RequestType {
  ID_CARD = 'ID_CARD',
  PASSPORT = 'PASSPORT',
  CITIZENSHIP = 'CITIZENSHIP',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
}

export enum RequestStatus {
  CREATED = 'CREATED',
  IN_PROCESS = 'IN_PROCESS',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
}

export type UpdateRequestDto = {
  id: string;
  caseNumber?: string;
  type?: RequestType;
  status?: RequestStatus;
  submissionDate?: string;
  citizenId?: string;
  adminMessage?: string;
  processedAt?: string;
  processedBy?: string;
  appointment?: any;
  payment?: any;
  document?: any;
};
