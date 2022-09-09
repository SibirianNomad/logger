import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { Order } from '@app/crypto-finance/domain/value-object/repository/order';
import { Filter } from '@app/crypto-finance/domain/value-object/repository/filter';

export class LogListQuery {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = null;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  take?: number = null;

  @ApiProperty({ required: false, type: () => [Filter] })
  filters: Filter[];

  @ApiProperty({ required: false, type: () => [Order] })
  @IsOptional()
  @Type(() => Order)
  orders?: Order[];
}
