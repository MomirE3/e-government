import { Address } from '../../address/entities/address.entity';

export interface Citizen {
  id: string;
  jmbg: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  requests: any[];
  infractions: any[];
  address: Address | null;
}
