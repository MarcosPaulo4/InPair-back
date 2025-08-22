import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { handleError } from '../../common/utils/error.utils';
import { UploadService } from '../upload/upload.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly uploadService: UploadService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.userAlreadyExists(createUserDto.email);
    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      const savedUser = await this.userRepository.save(user);
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword as User;
    } catch (error) {
      throw new BadRequestException('Error creating user');
    }
  }

  async saveProfileImg(userId: string, imageUrl: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.profileImgUrl = imageUrl;
    const updatedUser = await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async getProfileImgUploadUrl(fileType: string) {
    return this.uploadService.getPressignedUrl(fileType);
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      const { password, createdAt, updatedAt, id: ID, ...filteredUser } = user;
      return filteredUser as User;
    } catch (error) {
      handleError(error, 'Error finding user', this.logger);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async userAlreadyExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user;
  }
}
