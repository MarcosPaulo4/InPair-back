import { SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from '../dto/pagination.dto';

export async function paginatedQueryBuilder<T>(
  qb: SelectQueryBuilder<T>,
  pagination: PaginationDto,
): Promise<{
  data: T[];
  total: number;
  limit: number;
  offset: number;
}> {
  const limit = pagination.limit ?? 10;
  const offset = pagination.offset ?? 0;

  const [data, total] = await qb.skip(offset).take(limit).getManyAndCount();

  return {
    data,
    total,
    limit,
    offset,
  };
}
