import { RequestType, RequestStatus } from '@prisma/client';

export type CreateRequestDto = {
  caseNumber: string;
  type: RequestType;
  status: RequestStatus;
  submissionDate: string;
  citizenId: string;
  appointment: any;
  payment: any;
  document: any;
};
