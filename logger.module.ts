import { Module } from '@nestjs/common';
import { ModuleVersion } from '@app/crypto-finance/decorators';
import { LoggerService } from './services/logger.service';
import { AppConfigModule } from '../app-config/app-config.module';
import { LogRepository } from './repositories/log.repository';
import { LoggerConfig } from './config/logger.config';
import { ConfigService } from '@nestjs/config';
import { LoggerAdminService } from './services/logger-admin.service';
import { LoggerAdminController } from './controllers/logger-admin.controller';
import { SharedModule } from '../shared/shared.module';
import { permissions } from './constants/permissions';
import { LOGGER_MODULE_NAME } from './constants/module-name';

@ModuleVersion('0.2.1')
@Module({
  imports: [
    AppConfigModule,
    SharedModule.forFeature({
      module: LOGGER_MODULE_NAME,
      permissions,
    }),
  ],
  providers: [LoggerConfig, LoggerService, LogRepository, ConfigService, LoggerAdminService],
  controllers: [LoggerAdminController],
  exports: [LoggerService, LogRepository, LoggerConfig, LoggerAdminService],
})
export class LoggerModule {}
