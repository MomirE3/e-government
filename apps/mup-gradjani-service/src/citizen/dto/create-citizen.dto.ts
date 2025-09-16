import { CreateAddressDto } from '../../address/dto/create-address.dto';

export class CreateCitizenDto {
  jmbg: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // requests: Request[];
  // infractions: Infraction[];
  address: CreateAddressDto;
}
