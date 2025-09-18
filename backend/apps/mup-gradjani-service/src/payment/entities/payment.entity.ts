import { Request } from '../../requests/entities/request.entity';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  referenceNumber: string;
  status: string;
  timestamp: string;
  requestId: string;
  request?: Request;
}
