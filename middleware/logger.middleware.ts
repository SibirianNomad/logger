import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { StoreLogCommand } from '../dto/command/repositories/store-log.command';
import { LogRepository } from './../repositories/log.repository';
import { UserId } from '@app/crypto-finance/domain/value-object/user/user-id';
import * as jwt from 'jsonwebtoken';
import { LoggerConfig } from '../config/logger.config';

@Injectable()
export class LoggerRequestAuthBearerMiddleware implements NestMiddleware {
  constructor(private readonly logRepository: LogRepository, private readonly loggerConfig: LoggerConfig) {}

  /**
   * @description middleware for logging authorized user request
   */
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeaders = req.headers.authorization;
      if (authHeaders && (authHeaders as string).split(' ')[1]) {
        const { query, body } = req;
        const ip = JSON.stringify(req.headers['x-real-ip']) || req.ip;
        const browser = req.headers['user-agent'];
        const userId = this.getUserId(authHeaders);
        const storeLogCommand = new StoreLogCommand(
          new UserId(userId),
          req.baseUrl,
          browser,
          JSON.stringify(query),
          JSON.stringify(body),
          ip,
        );
        this.logRepository.store(storeLogCommand);
      }
    } catch (e: any) {
      console.log('LoggerMiddleware: Ошибка логирования запроса:', e);
    }
    next();
  }

  /**
   * @param authHeaders
   * @example Berear eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDAwMDAwLTAwMDAtM
   * @private
   * @description get user id from header bearer token
   */
  private getUserId(authHeaders: string): string {
    const token = (authHeaders as string).split(' ')[1];
    // токен авторизации в данном модуле проверяется только на валидность подписи, запрос логируется даже если токен просрочен
    const decoded: any = jwt.verify(token, this.loggerConfig.secret, { ignoreExpiration: true });
    return decoded.id;
  }
}
