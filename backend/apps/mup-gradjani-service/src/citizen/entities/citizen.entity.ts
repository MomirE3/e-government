import { Address } from '../../address/entities/address.entity';
import { Infraction } from '../../infraction/entities/infraction.entity';

export interface Citizen {
  id: string;
  jmbg: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
  requests: any[];
  infractions: Infraction[];
  address: Address | null;
}
