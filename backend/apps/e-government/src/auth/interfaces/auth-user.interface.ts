import { Role } from '../enums/role.enum';

export interface AuthUser {
  id: string;
  jmbg: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface JwtPayload {
  sub: string;
  jmbg: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
