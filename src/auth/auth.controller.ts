import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  //@UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() userLoginDto: UserLoginDto){
    return this.authService.signIn(userLoginDto);
  }
}
 