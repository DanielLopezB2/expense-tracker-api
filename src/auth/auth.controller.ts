import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login() {
    return "Este es el Login";
  }

  @Post('logout')
  logout() {
    return "Este es el Logout";
  }

  
}
