import { Address } from '../../address/entities/address.entity';
import { Infraction } from '../../infraction/entities/infraction.entity';
import { Request } from '../../requests/entities/request.entity';

export interface Citizen {
  id: string;
  jmbg: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
  requests: Request[];
  infractions: Infraction[];
  address: Address | null;
}
