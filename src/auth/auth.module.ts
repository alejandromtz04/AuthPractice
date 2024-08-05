import { Inject, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstant } from './constants/constants';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstant.secret,
      signOptions: { expiresIn: '1d' }
    }),

  ],
  
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService, JwtService],
})
export class AuthModule {}
