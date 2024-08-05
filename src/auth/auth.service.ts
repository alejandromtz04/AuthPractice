import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CustomHttpException } from 'src/global/custom-exception';
import { UserService } from 'src/user/user.service';
import { JwtService } from "@nestjs/jwt";
import { jwtConstant } from './constants/constants';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async signIn({email, password}: UserLoginDto) {

    try {
      const user = await this.userRepository.findOne({
        relations: {
          //RELATIONS HERE.
        }, where: {
          email
        }
      })

      if(!user) {
        return new CustomHttpException('email not found', HttpStatus.NOT_FOUND);
      }
      
      if (!user.checkPassword(password)) {
        return new CustomHttpException('Incorrect Password', HttpStatus.UNAUTHORIZED);
      }

      if (user.isActivated == false) {
        return new CustomHttpException('User not found', HttpStatus.NOT_FOUND);
      }

      user.password = undefined;
      const payload = {  email: user.email, sub: user.id };
      const token = await this.jwtService.signAsync(payload, { secret: jwtConstant.secret });

      return {
        access_token: token,
        ok: true,
        text: `Hola ${user.name}`,
        user: user
      }

    } catch (e) {
      console.error(e);
      return new CustomHttpException('Internal server error on method: Login', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
