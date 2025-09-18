import { Request } from '../../requests/entities/request.entity';

export interface Document {
  id: string;
  name: string;
  type: string;
  issuedDate: string;
  requestId: string;
  request?: Request;
}
