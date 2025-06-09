import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { handleError } from 'src/common/utils/error.utils';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      if (await this.findEmail(createUserDto.email)) {
        throw new BadRequestException('User with this email already exists');
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      const savedUser = await this.userRepository.save(user);
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword as User;
    } catch (error) {
      handleError(error, 'Error creating user', this.logger);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  private async findEmail(email: string): Promise<boolean> {
    const userEmail = await this.userRepository.findOne({
      where: { email },
    });
    return !!userEmail;
  }
}
