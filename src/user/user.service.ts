import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ILike, Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CustomHttpException } from 'src/global/custom-exception';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { find } from 'rxjs';
import { SearchUserDto } from './dto/search-user.dto';
@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

    if (!id) {
      return {
        ok: false,
        messaje: "Enter the id",
        status: HttpStatus.BAD_REQUEST
      }
    }

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

  async findByEmail(email: string) {
    try {
      if (!email) {
        return {
          ok: false,
          message: "Enter the id.",
          status: HttpStatus.BAD_REQUEST
        }
      }

      const findEmail = await this.userRepository.findOne({ 
        where: { 
          email,
          isActivated: true
        }, relations: {
          //realtions here
        }
      });

      if (!findEmail || findEmail === null || findEmail === undefined) {
        return {
          ok: false,
          message: "Email not found",
          status: HttpStatus.NOT_FOUND,
        }
      } else {
        return {
          ok: true,
          message: "Email was found",
          status: HttpStatus.FOUND,
          object: findEmail.email
        }
      }

    } catch (e) {
      throw new CustomHttpException(
        "Internal server error on method: findByEmail in userService.ts",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {

      const user = await this.userRepository.findOne({ where: { id, isActivated: true }});

      if (!user || user.isActivated == false) {
        return {
          ok: false,
          mesage: "User not found",
          httpStatus: HttpStatus.NOT_FOUND
        }
      }

      const emptyFields = [];
      Object.entries(updateUserDto).forEach(([key, value]) => {
        if (value === undefined || value === null || value === ''){
          emptyFields.push(key)
        }
      })

      if (emptyFields.length > 0) {
        return new BadRequestException(`The following fields are empty or undefined: ${emptyFields.join(', ')}`);
      }

      user.name = updateUserDto.name;
      user.lastName = updateUserDto.lastName;
      user.age = updateUserDto.age;
      user.userName = updateUserDto.userName;
      user.password = updateUserDto.password;

      await this.userRepository.save(user);
      return {
        ok: true,
        message: "User saved successfully",
        status: HttpStatus.OK,
        object: user
      }
      
    } catch (e) {
      throw new CustomHttpException(
        "Internal server error on method: updateUser in user.service.ts",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteUser(id: number) {
    try {
      const findUser = await this.userRepository.findOne({ where: { id, isActivated: true }})

      if (!findUser || findUser.isActivated == false) {
        return {
          ok: false,
          message: "User not found",
          HttpStatus: HttpStatus.NOT_FOUND
        }
      }

      findUser.isActivated = false;

      await this.userRepository.save(findUser)
      return {
        ok: true,
        message: `User ${findUser.name} was deleted`,
        status: HttpStatus.OK
      }

    } catch (e) {
      throw new CustomHttpException(
        "Internal server error on method: deleteUser in service method",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async listPaginated({ page, limit, name, lastName, email, userName }: SearchUserDto) {
    try { 
      const [users, totalItems] = await this.userRepository.findAndCount({
        relations: { /* relations here */ },
        where: {
          isActivated: true,
          name: ILike(`%${name}%`),
          lastName: ILike(`%${lastName}%`),
          email: ILike(`%${email}%`),
          userName: ILike(`%${userName}%`)
        },
        skip: (page - 1) * limit,
        take: limit
      });

      if (users.length > 0) {
        let totalPag: number = totalItems / limit;

        if (totalPag % 1 !== 0) {
          totalPag = Math.trunc(totalPag) + 1;
        }

        let nextPag: number = page >= totalPag ? page : Number(page) + 1;
        let prevPag: number = page <= 1 ? page : page - 1;

        console.log(page);
        return {
          ok: true,
          message: 'Users found',
          users,
          totalPag,
          currentPag: Number(page),
          nextPag: Number(nextPag),
          prevPag: Number(prevPag),
          take: Number(limit)
        };
      } else {
        return {
          ok: false,
          message: 'Users not found or doesnt exist',
          status: HttpStatus.NOT_FOUND
        }
      }
    } catch (e) {
      return new CustomHttpException(
        `Error in userService method: listPaginated. \n ${e.message}`, 
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
