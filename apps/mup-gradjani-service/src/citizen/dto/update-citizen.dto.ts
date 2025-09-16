import { CreateAddressDto } from '../../address/dto/create-address.dto';

export class UpdateCitizenDto {
  id: string;
  jmbg: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // requests: Request[];
  // infractions: Infraction[];
  address: CreateAddressDto;
}
