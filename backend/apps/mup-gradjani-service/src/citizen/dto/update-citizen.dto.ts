import { UpdateAddressDto } from '../../address/dto/update-address.dto';

export class UpdateCitizenDto {
  id: string;
  jmbg: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: UpdateAddressDto;
}
