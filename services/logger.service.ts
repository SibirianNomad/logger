import { ConsoleLogger, Injectable, LoggerService as BaseLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { LoggerChanel } from '../enums/logger-chanel.enum';
import { AppConfigService } from '../../app-config/services/app-config.service';
import * as util from 'util';

@Injectable()
export class LoggerService extends ConsoleLogger implements BaseLoggerService {
  private logger: winston.Logger;
  private loggerSql: winston.Logger;

  constructor(private configService: AppConfigService) {
    super();
    this.setLogLevels(configService.appLogLevels);
    winston.loggers.add(LoggerChanel.DEFAULT, {
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(
          (info) =>
            `${info.timestamp} ${info.level}: ${info.message}` + (info.splat !== undefined ? `${info.splat}` : ' '),
        ),
      ),
      transports: [this.getDefaultTransport()],
    });
    winston.loggers.add(LoggerChanel.SQL, {
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(
          (info) =>
            `${info.timestamp} ${info.level}: ${info.message}` + (info.splat !== undefined ? `${info.splat}` : ' '),
        ),
      ),
      transports: [this.getSqlTransport()],
    });

    this.logger = winston.loggers.get(LoggerChanel.DEFAULT);
    this.loggerSql = winston.loggers.get(LoggerChanel.SQL);
    this.replaceConsole();
  }

  protected getDefaultTransport() {
    let filename = 'logs/$2/%DATE%_$1.log';
    filename = filename
      .replace('$1', process.env.LOG_FILE_NAME || 'app')
      .replace('$2', process.env.MARKET_NAME_ORDER_QUEUE || 'default');
    return new DailyRotateFile({
      filename: filename,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      // prepend: true,
      level: 'debug',
    });
  }

  protected getSqlTransport() {
    let filename = 'logs/$2/sql/%DATE%_$1.sql.log';
    filename = filename
      .replace('$1', process.env.LOG_FILE_NAME || 'app')
      .replace('$2', process.env.MARKET_NAME_ORDER_QUEUE || 'default');
    return new DailyRotateFile({
      filename: filename,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      // prepend: true,
      level: 'debug',
    });
  }

  protected replaceConsole() {
    const originConsoleLog = console.log;
    console.log = (...data: any[]) => {
      originConsoleLog(...data);
      for (const index in data) {
        if (typeof data[index] === 'string') {
          data[index] = data[index].replace(
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
            '',
          );
        }
      }
      if (data && JSON.stringify(data).indexOf('query') !== -1) {
        this.loggerSql.debug(data);
      } else {
        this.logger.debug(data);
      }
    };

    const originConsoleError = console.error;
    console.error = (...data: any[]) => {
      originConsoleError(...data);
      for (const index in data) {
        if (typeof data[index] === 'string') {
          data[index] = data[index].replace(
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
            '',
          );
        }
      }
      this.logger.error(data);
    };
  }

  debug(message: any, ...optionalParams: any[]): any {
    if (typeof message === 'object') {
      message = util.inspect(message, { showHidden: false, depth: null, colors: true });
    }
    super.debug(message, ...optionalParams);
    this.logger.debug(message);
  }

  error(message: any, ...optionalParams: any[]): any {
    super.error(message, ...optionalParams);
    this.logger.error(message);
  }

  log(message: any, ...optionalParams: any[]): any {
    if (typeof message === 'object') {
      message = util.inspect(message, { showHidden: false, depth: null, colors: true });
    }
    super.log(message, ...optionalParams);
    this.logger.debug(message);
  }

  verbose(message: any, ...optionalParams: any[]): any {
    if (typeof message === 'object') {
      message = util.inspect(message, { showHidden: false, depth: null, colors: true });
    }
    super.verbose(message, ...optionalParams);
    this.logger.verbose(message);
  }

  warn(message: any, ...optionalParams: any[]): any {
    if (typeof message === 'object') {
      message = util.inspect(message, { showHidden: false, depth: null, colors: true });
    }
    super.warn(message, ...optionalParams);
    this.logger.warn(message);
  }
}
