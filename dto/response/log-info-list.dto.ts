import { ApiProperty } from '@nestjs/swagger';
import { LogInfoDto } from './log-info.dto';

export class LogInfoListDto {
  @ApiProperty()
  public page: number;
  @ApiProperty()
  public take: number;
  @ApiProperty()
  public total: number;
  @ApiProperty({
    type: [LogInfoDto],
  })
  public data: LogInfoDto[];

  constructor(page: number, take: number, total: number, transactions: LogInfoDto[]) {
    this.page = page;
    this.take = take;
    this.total = total;
    this.data = transactions;
  }
}
