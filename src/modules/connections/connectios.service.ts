import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { handleError } from '../../common/utils/error.utils';
import { paginatedQueryBuilder } from '../../common/utils/pagination.utils';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { Connection } from './entities/connection.entity';
import { ConnectionStatusEnum } from './enum/connection-status.enum';

@Injectable()
export class ConnectionService {
  private readonly logger = new Logger(ConnectionService.name);

  constructor(
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
  ) {}

  async sendConnection(
    dto: CreateConnectionDto,
    requesterId: string,
  ): Promise<Connection> {
    if (requesterId === dto.receiverId) {
      throw new BadRequestException('Can not connect to your self');
    }

    const connectionExists = await this.connectionAlreadyExists(
      requesterId,
      dto.receiverId,
    );

    if (connectionExists) {
      throw new ConflictException('Connection already exists');
    }

    const connection = this.connectionRepository.create({
      requesterId,
      receiverId: dto.receiverId,
      status: ConnectionStatusEnum.PENDING,
    });

    try {
      return await this.connectionRepository.save(connection);
    } catch (error) {
      handleError(error, 'Error creating connection', this.logger);
    }
  }

  async acceptConnection(dto: UpdateConnectionDto): Promise<Connection> {
    const connection = await this.findPendingConnectionOrThrow(
      dto.requesterId,
      dto.receiverId,
    );

    connection.status = ConnectionStatusEnum.ACCEPTED;
    try {
      const updateConnection = await this.connectionRepository.save(connection);
      return updateConnection;
    } catch (error) {
      handleError(error, 'Error updating connection', this.logger);
    }
  }
  async refuseConnection(dto: UpdateConnectionDto) {
    const connection = await this.findPendingConnectionOrThrow(
      dto.requesterId,
      dto.receiverId,
    );

    return this.connectionRepository.delete({
      requesterId: connection.requesterId,
      receiverId: connection.receiverId,
    });
  }

  async findPendingConnectionList(
    receiverId: string,
    pagination: PaginationDto,
  ) {
    const pendingConnections = this.connectionRepository
      .createQueryBuilder('connection')
      .leftJoinAndSelect('connection.requester', 'requester')
      .where('connection.receiverId = :receiverId', { receiverId })
      .andWhere('connection.status = :status', {
        status: ConnectionStatusEnum.PENDING,
      })
      .select([
        'connection.id',
        'connection.createdAt',
        'connection.status',
        'requester.id',
        'requester.name',
        'requester.email',
      ]);

    return paginatedQueryBuilder(pendingConnections, pagination);
  }

  async findConnectionList(receiverId: string, pagination: PaginationDto) {
    const connections = this.connectionRepository
      .createQueryBuilder('connection')
      .leftJoinAndSelect('connection.requester', 'requester')
      .where('connection.receiverId = :receiverId', { receiverId })
      .andWhere('connection.status = :status', {
        status: ConnectionStatusEnum.ACCEPTED,
      })
      .select([
        'connection.id',
        'connection.createdAt',
        'connection.status',
        'requester.id',
        'requester.name',
        'requester.email',
      ]);

    return paginatedQueryBuilder(connections, pagination);
  }

  private async findPendingConnectionOrThrow(
    requesterId: string,
    receiverId: string,
  ): Promise<Connection> {
    const connection = await this.connectionRepository.findOne({
      where: { requesterId, receiverId },
    });

    if (!connection) {
      throw new BadRequestException('Connection not found');
    }

    if (connection.status !== ConnectionStatusEnum.PENDING) {
      throw new BadRequestException('Connection already updated');
    }

    if (connection.receiverId !== receiverId) {
      throw new BadRequestException('You don’t have access to this invite');
    }

    return connection;
  }

  private async findConnection(
    requesterId: string,
    receiverId: string,
  ): Promise<Connection | null> {
    return this.connectionRepository.findOne({
      where: [
        { requesterId, receiverId },
        { requesterId: receiverId, receiverId: requesterId },
      ],
    });
  }

  async connectionAlreadyExists(
    requesterId: string,
    receiverId: string,
  ): Promise<boolean> {
    const connection = await this.findConnection(requesterId, receiverId);
    return !!connection;
  }
}
