import { ApiProperty } from '@nestjs/swagger';
import { Log } from '../../models/log.model';

export class LogInfoDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  ip: string;
  @ApiProperty()
  browser: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  url: string;
  @ApiProperty()
  query: string;
  @ApiProperty()
  body: string;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  updatedAt: string;

  constructor(log: Log) {
    this.id = log.id;
    this.ip = log.ip;
    this.browser = log.browser;
    this.userId = log.userId;
    this.url = log.url;
    this.query = log.query;
    this.body = log.body;
    this.createdAt = log.createdAt;
    this.updatedAt = log.updatedAt;
  }
}
