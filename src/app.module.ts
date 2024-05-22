import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RolModule } from './rol/rol.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { User } from './user/entities/user.entity';
import { Rol } from './rol/entities/rol.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '159753258',
      database: 'ChatApi',
      entities: [User, Rol],
      synchronize: true // delete in production
    }),
    UserModule, RolModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
