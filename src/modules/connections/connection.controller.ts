import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from '../users/entities/user.entity';
import { ConnectionService } from './connectios.service';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';

@Controller('connection')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post()
  async sendConnection(
    @CurrentUser() user: User,
    @Body() dto: CreateConnectionDto,
  ) {
    const connection = await this.connectionService.sendConnection(
      dto,
      user.id,
    );
    return connection;
  }

  @Get('pending')
  async pendingList(
    @CurrentUser() user: User,
    @Query() pagination: PaginationDto,
  ) {
    const findConnectionList =
      await this.connectionService.findPendingConnectionList(
        user.id,
        pagination,
      );
    return findConnectionList;
  }

  @Get()
  async connectionList(
    @CurrentUser() user: User,
    @Query() pagination: PaginationDto,
  ) {
    const connection = await this.connectionService.findConnectionList(
      user.id,
      pagination,
    );

    return connection;
  }

  @Patch('accept/:requesterId')
  async acceptConnection(
    @CurrentUser() user: User,
    @Param('requesterId') requesterId: string,
  ) {
    const dto: UpdateConnectionDto = {
      requesterId,
      receiverId: user.id,
    };
    const updateConnection = await this.connectionService.acceptConnection(dto);

    return updateConnection;
  }

  @Delete('refuse/:requesterId')
  async refuseConnection(
    @CurrentUser() user: User,
    @Param('requesterId') requesterId: string,
  ) {
    const dto: UpdateConnectionDto = {
      requesterId,
      receiverId: user.id,
    };
    const deleteConnection = await this.connectionService.refuseConnection(dto);
    return deleteConnection;
  }
}
