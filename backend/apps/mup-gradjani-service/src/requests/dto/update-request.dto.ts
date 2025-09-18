import { RequestType, RequestStatus } from '../entities/request.entity';

export type UpdateRequestDto = {
  id: string;
  caseNumber: string;
  type: RequestType;
  status: RequestStatus;
  submissionDate: string;
  citizenId: string;
  appointment: any;
  payment: any;
  document: any;
};
