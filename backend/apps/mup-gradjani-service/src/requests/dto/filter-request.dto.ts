import { RequestStatus, RequestType } from '../entities/request.entity';

export type FilterRequestDto = {
  citizenId?: string;
  requestStatus?: RequestStatus;
  requestType?: RequestType;
};
