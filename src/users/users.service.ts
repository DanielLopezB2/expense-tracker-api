import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async register(createUserDto: CreateUserDto) {

    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
  
      await this.userRepository.save(user);

      const { password: _, updatedAt, deletedAt, ...restUser } = user;
      return restUser;
  
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  async findOneByEmail(email: string) {

    const user = await this.userRepository.findOne(
      {
        where: { email },
        select: { email: true, password: true, id: true, name: true }
      }
    );

    if (!user) throw new NotFoundException(`User with email ${email} not found.`)
    
    return user;
  }

  private handleDbExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

}
