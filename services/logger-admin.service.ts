import { Page } from '@app/crypto-finance/domain/value-object/repository/page';
import { Injectable } from '@nestjs/common';
import { LogListQuery } from '../dto/query/log-list.query';
import { LogInfoListDto } from '../dto/response/log-info-list.dto';
import { LogRepository } from '../repositories/log.repository';

@Injectable()
export class LoggerAdminService {
  constructor(private readonly logRepository: LogRepository) {}

  async list(page: Page, query: LogListQuery) {
    const result = await this.logRepository.allWithCount(page, query);

    return new LogInfoListDto(
      page?.page,
      page?.limit,
      result.total,
      result.entities.map((log) => {
        return log.toInfoDto();
      }),
    );
  }
}
