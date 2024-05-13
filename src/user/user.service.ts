import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CustomHttpException } from 'src/global/custom-exception';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try { 

      const emptyFields = [];
      Object.entries(createUserDto).forEach(([key, value]) => {
        if (value === undefined || value === null || value === ''){
          emptyFields.push(key)
        }
      })

      if (emptyFields.length > 0) {
        return new BadRequestException(`The following fields are empty or undefined: ${emptyFields.join(', ')}`);
      }

      const findUser = await this.userRepository.findOne({ where: { userName: createUserDto.userName }});
      if (findUser) {
        return new HttpException('This username already exist.', HttpStatus.CONFLICT);
      }

      const user = new User();

      user.name = createUserDto.name;
      user.lastName = createUserDto.lastName;
      user.age = createUserDto.age;
      user.userName = createUserDto.userName;
      user.password = createUserDto.password;
      user.isActivated = createUserDto.isActivated;

      await this.userRepository.save(user);
      return {
        ok: true,
        message: 'Was created',
        status: HttpStatus.CREATED,
        object: user
      } 
      
    } catch (e) {
      throw new CustomHttpException(
        'Internal server error on method: Create of userService.ts', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllUser() {
   try {
    const users = await this.userRepository.find({ where: { isActivated: true }});

    if (!users || users.length == 0) { 
      return {
        ok: false,
        message: "Users not found",
        status: HttpStatus.NOT_FOUND
      }
    }

    if (users) {
      return {
        ok: true,
        message: "Was found",
        status: HttpStatus.FOUND,
        object: users
      }
    }

   } catch(e) {
    throw new CustomHttpException(
      "Internal server error in method",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
   }
  }

  async findById(id: number) {
   try { 
    const findUser = await this.userRepository.findOne({ where: { id: id, isActivated: true }});

    if (!findUser || findUser == null || findUser == undefined) {
      return {
        ok: false,
        message: "User not found",
        status: HttpStatus.NOT_FOUND
      }
    }

    if (findUser) {
      return {
        ok: true,
        message: "User found",
        status: HttpStatus.FOUND,
        object: findUser
      }
    }

   } catch (e) {
    throw new CustomHttpException(
      "Internal server error on method: findByid of userService.ts",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
   } 
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
