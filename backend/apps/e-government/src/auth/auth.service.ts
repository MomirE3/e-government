import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { AuthUser, JwtPayload } from './interfaces/auth-user.interface';
import { Role } from './enums/role.enum';
import { LoginResponseDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('MUP-SERVICE') private readonly mupService: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    try {
      console.log(`🔍 Pokušavam da pronađem korisnika sa email: ${email}`);

      // Poziv mikroservisa za pronalaženje građanina po email-u
      const citizen = await firstValueFrom(
        this.mupService.send('findCitizenByEmail', { email }),
      );

      console.log(`📋 Pronađen korisnik:`, citizen ? 'DA' : 'NE');

      if (citizen) {
        console.log(`🔐 Ima lozinku:`, citizen.password ? 'DA' : 'NE');
        console.log(
          `🔐 Hash lozinke:`,
          citizen.password ? citizen.password.substring(0, 20) + '...' : 'N/A',
        );
        console.log(`🔐 Uneta lozinka:`, password);

        if (citizen.password) {
          const passwordMatch = await bcrypt.compare(
            password,
            citizen.password as string,
          );
          console.log(`🔐 Lozinka se poklapa:`, passwordMatch ? 'DA' : 'NE');
        }
      }

      if (
        citizen &&
        citizen.password &&
        (await bcrypt.compare(password, citizen.password as string))
      ) {
        console.log(`✅ Lozinka je ispravna za korisnika: ${email}`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _password, ...result } = citizen;
        return {
          ...result,
          role: citizen.role || Role.CITIZEN,
        };
      }

      console.log(`❌ Neispravni kredencijali za korisnika: ${email}`);
      return null;
    } catch (error) {
      console.error(`🚨 Greška pri validaciji korisnika ${email}:`, error);
      return null;
    }
  }

  async validateUserByPayload(payload: JwtPayload): Promise<AuthUser | null> {
    try {
      const citizen = await firstValueFrom(
        this.mupService.send('findOneCitizen', payload.sub),
      );

      if (citizen) {
        return {
          id: citizen.id,
          jmbg: citizen.jmbg,
          firstName: citizen.firstName,
          lastName: citizen.lastName,
          email: citizen.email,
          role: citizen.role || Role.CITIZEN,
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  login(user: AuthUser): LoginResponseDto {
    const payload: JwtPayload = {
      sub: user.id,
      jmbg: user.jmbg,
      email: user.email,
      role: user.role,
    };

    console.log('🔑 Generating JWT token for user:', user.email);
    console.log('🔑 JWT payload:', payload);

    const token = this.jwtService.sign(payload);
    console.log('🔑 Generated token:', token.substring(0, 50) + '...');

    const response = {
      access_token: token,
      user: {
        id: user.id,
        jmbg: user.jmbg,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };

    console.log('🔑 Login response:', response);
    return response;
  }

  async register(registerDto: RegisterDto): Promise<void> {
    try {
      console.log(`📝 Registracija novog korisnika: ${registerDto.email}`);

      // Hash password
      console.log(`🔐 Originalna lozinka:`, registerDto.password);
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      console.log(
        `🔐 Hash-ovana lozinka:`,
        hashedPassword.substring(0, 20) + '...',
      );

      // Kreiraj građanina kroz MUP mikroservis
      const citizenData = {
        ...registerDto,
        password: hashedPassword,
        role: Role.CITIZEN,
      };

      console.log(`🔄 Šaljem zahtev za kreiranje korisnika u MUP servis...`);

      const newCitizen = await firstValueFrom(
        this.mupService.send('createCitizenWithAuth', citizenData),
      );

      console.log(`✅ Korisnik uspešno kreiran sa ID: ${newCitizen.id}`);
    } catch (error) {
      console.error(
        `🚨 Greška pri registraciji korisnika ${registerDto.email}:`,
        error,
      );
      if (
        error.message?.includes('unique') ||
        error.message?.includes('Unique constraint')
      ) {
        throw new ConflictException(
          'Korisnik sa ovim email-om ili JMBG već postoji',
        );
      }
      throw error;
    }
  }

  async createAdmin(adminData: RegisterDto): Promise<LoginResponseDto> {
    try {
      const hashedPassword = await bcrypt.hash(adminData.password, 10);

      const adminCitizenData = {
        ...adminData,
        password: hashedPassword,
        role: Role.ADMIN,
      };

      const newAdmin = await firstValueFrom(
        this.mupService.send('createCitizenWithAuth', adminCitizenData),
      );

      const user: AuthUser = {
        id: newAdmin.id,
        jmbg: newAdmin.jmbg,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        email: newAdmin.email,
        role: Role.ADMIN,
      };

      return this.login(user);
    } catch (error) {
      if (error.message?.includes('unique')) {
        throw new ConflictException(
          'Administrator sa ovim email-om ili JMBG već postoji',
        );
      }
      throw error;
    }
  }
}
