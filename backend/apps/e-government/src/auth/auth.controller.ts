import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import type { LoginResponseDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import type { AuthUser } from './interfaces/auth-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req: { user: AuthUser }): LoginResponseDto {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    await this.authService.register(registerDto);
    return {
      message: 'Uspešno ste se registrovali! Sada se možete prijaviti.',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin/create')
  async createAdmin(@Body() adminData: RegisterDto): Promise<LoginResponseDto> {
    return this.authService.createAdmin(adminData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: AuthUser): AuthUser {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(): { message: string } {
    // JWT se invalidira na klijentskoj strani brisanjem tokena
    return { message: 'Uspešno ste se odjavili' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verifyToken(@CurrentUser() user: AuthUser): {
    valid: boolean;
    user: AuthUser;
  } {
    return { valid: true, user };
  }
}
