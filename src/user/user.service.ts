import { BadRequestException, ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CustomHttpException } from 'src/global/custom-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    try { 

      if (createUserDto == null || createUserDto == undefined) {
        throw new BadRequestException('Enter the correct data!');
      }

      const findUser = await this.userRepository.findOne({ where: { userName: createUserDto.userName }});
      if (findUser) {
        throw new ConflictException('This username already exist.')
      }

      const user = new User();

      user.name = createUserDto.name;
      user.lastName = createUserDto.lastName;
      user.age = createUserDto.age;
      user.userName = createUserDto.userName;
      user.password = createUserDto.password;
      user.isActivated = createUserDto.isActivated;

      await this.userRepository.save(user);
      console.log(user)
      return {
        ok: true,
        message: 'Was created',
        status: HttpStatus.CREATED,
        object: user
      }
      
    } catch (e) {
      console.log(e)
      throw new CustomHttpException(
        'Internal server error on method: Create of userService.ts', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findAll() {
   return 'hola'
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
