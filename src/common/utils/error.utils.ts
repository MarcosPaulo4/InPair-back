import {
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export function handleError(error: any, message: string, logger?: Logger) {
  if (logger) {
    logger.error(message, error.message, error.stack);
  }
  if (error instanceof HttpException) {
    throw error;
  }
  throw new InternalServerErrorException(message);
}
