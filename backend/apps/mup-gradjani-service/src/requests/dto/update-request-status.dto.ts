import { RequestStatus } from '../entities/request.entity';

export type UpdateRequestStatusDto = {
  status: RequestStatus;
  adminMessage?: string;
  processedBy?: string;
};
