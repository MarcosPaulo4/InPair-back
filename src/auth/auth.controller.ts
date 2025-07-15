import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { User } from 'src/modules/users/entities/user.entity';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { UserPayload } from './models/UserPayload';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(
    @Req() req: AuthRequest,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const {
      access_token,
      refresh_token,
      user: userData,
    } = await this.authService.login(user);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 15,
    });
    res.cookie('token', access_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 30,
    });

    return {
      user: userData,
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @CurrentUser() user: UserPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } =
      await this.authService.refreshToken(user);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 15,
    });
    res.cookie('token', access_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 30,
    });
  }

  @IsPublic()
  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') !== 'production',
      sameSite: 'strict',
    });
    return {
      message: 'logout successful',
    };
  }
}
