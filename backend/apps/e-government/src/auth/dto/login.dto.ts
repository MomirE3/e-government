import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  access_token: string;
  user: {
    id: string;
    jmbg: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}
