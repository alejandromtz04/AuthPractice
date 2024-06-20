import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CustomHttpException } from 'src/global/custom-exception';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UserService
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try { 

      //DEFINES EMPTY FIELDS TO KNOW IN JSON
      const emptyFields = []; 
      Object.entries(createUserDto).forEach(([key, value]) => {
        if (value === undefined || value === null || value === ''){
          emptyFields.push(key)
        }
      })

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

      if (emptyFields.length > 0) {
        return new BadRequestException(`The following fields are empty or undefined: ${emptyFields.join(', ')}`);
      }

      const findUser = await this.userRepository.findOne({ where: { userName: createUserDto.userName }});
      if (findUser) {
        return new HttpException('This username already exist.', HttpStatus.BAD_REQUEST);
      }

      const findEmail = await this.userRepository.findOne({ where: { email: createUserDto.email }});
      if (findEmail) {
        return new CustomHttpException('This Email already exist.', HttpStatus.BAD_REQUEST)
      }

      const user = new User();
      

      user.name = createUserDto.name;
      user.lastName = createUserDto.lastName;
      user.age = createUserDto.age;
      user.userName = createUserDto.userName;
      user.email = createUserDto.email;
      user.password = hashedPassword;
      user.isActivated = createUserDto.isActivated;

      await this.userRepository.save(user);
      return {
        ok: true,
        message: 'Was created',
        status: HttpStatus.CREATED,
        object: user
      } 
      
    } catch (e) {
      console.log(e);
      throw new CustomHttpException(
        'Internal server error on method: Create of userService.ts', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async login({email, password}: UserLoginDto) {

    const user = await this.userService.findByEmail(email);

    if (!user || user == undefined || user == null) {
      return new CustomHttpException(
        'Invalid credentials',
        HttpStatus.BAD_REQUEST
      )
    }

    const validPassword = await bcrypt.
  }
}
