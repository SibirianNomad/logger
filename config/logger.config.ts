import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerConfig {
  public readonly secret: string;

  constructor(private configService: ConfigService) {
    this.secret = configService.get<string>('JWT_SECRET', 'jwt-secret');
  }
}
