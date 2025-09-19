import { Role } from '../enums/role.enum';
import { Address } from '../../../../mup-gradjani-service/src/address/entities/address.entity';
import { Infraction } from '../../../../mup-gradjani-service/src/infraction/entities/infraction.entity';

export interface AuthUser {
  id: string;
  jmbg: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  address: Address;
  infractions: Infraction[];
}

export interface JwtPayload {
  sub: string;
  jmbg: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
