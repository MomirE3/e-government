import { Request } from '../../requests/entities/request.entity';

export interface Payment {
  id: string;
  amount: number;
  referenceNumber: string;
  timestamp: string;
  requestId: string;
  request?: Request;
}
