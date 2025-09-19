import { Request } from '../../requests/entities/request.entity';

export interface Appointment {
  id: string;
  dateTime: string;
  location: string;
  requestId: string;
  request?: Request;
}
