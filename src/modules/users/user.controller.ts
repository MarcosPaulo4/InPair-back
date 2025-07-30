import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return user;
  }

  @Get('me')
  async findUserById(@CurrentUser() user: User) {
    const foundUser = await this.userService.findById(user.id);
    return foundUser;
  }
}
