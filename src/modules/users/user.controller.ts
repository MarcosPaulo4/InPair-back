import { Body, Controller, Get, Post, Req } from '@nestjs/common';

import { CurrentUser } from '../../common/decorator/current-user.decorator';
import { IsPublic } from '../../common/decorator/is-public.decorator';
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

  @Post('profile-image/url')
  async getProfileImageUploadUrl(@Body() body: { fileType: string }) {
    return this.userService.getProfileImgUploadUrl(body.fileType);
  }

  @Post('profile-image/save')
  async saveProfileImage(
    @Req() req,
    @Body() body: { imageUrl: string },
    @CurrentUser() user: User,
  ) {
    return this.userService.saveProfileImg(user.id, body.imageUrl);
  }

  @Get('me')
  async findUserById(@CurrentUser() user: User) {
    const foundUser = await this.userService.findById(user.id);
    return foundUser;
  }
}
