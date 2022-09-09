import { Injectable } from '@nestjs/common';
import { FindManyOptions, getRepository, QueryRunner, Raw } from 'typeorm';
import { Log } from './../models/log.model';
import { StoreLogCommand } from './../dto/command/repositories/store-log.command';
import { Page } from '@app/crypto-finance/domain/value-object/repository/page';
import { LogListQuery } from '../dto/query/log-list.query';
import { Operator } from '@app/crypto-finance/domain/enums/repository/operator';
import { FindAndCountResult } from '@app/crypto-finance/domain/dto/resource/find-and-count-result';
import { UnknownFilterFieldException } from '@app/crypto-finance/domain/exception/unknown-filter-field.exception';

@Injectable()
export class LogRepository {
  async store(command: StoreLogCommand): Promise<any> {
    return await getRepository(Log).insert({
      ip: command.ip,
      userId: command.userId.value,
      browser: command.browser,
      url: command.url,
      query: command.query,
      body: command.body,
    });
  }

  /**
   *
   * @param page
   * @param query
   * @param queryRunner
   *
   * @throws UnknownFilterFieldException
   */
  async allWithCount(page: Page, query: LogListQuery, queryRunner: QueryRunner = null) {
    const repo = queryRunner ? queryRunner.manager.getRepository(Log) : getRepository(Log);

    const options: FindManyOptions = {
      relations: [],
      take: page?.limit,
      skip: page?.offset,
      where: {},
    };

    if (query.filters && query.filters.length > 0) {
      for (const filterItem of query.filters) {
        if (!Object.values(Operator).includes(filterItem.operator)) {
          continue;
        }
        switch (filterItem.field) {
          case 'userId':
            switch (filterItem.operator) {
              case Operator.IN:
              case Operator.NOT_IN:
                options.where[filterItem.field] = Raw(
                  (alias) => `( ${alias} )::varchar ${filterItem.operator} (:...${filterItem.field})`,
                  {
                    [filterItem.field]: filterItem.value,
                  },
                );
                break;
              default:
                options.where[filterItem.field] = Raw(
                  (alias) => `( ${alias} )::varchar ${filterItem.operator} :${filterItem.field}`,
                  {
                    [filterItem.field]: filterItem.value,
                  },
                );
                break;
            }
            break;
          default:
            throw new UnknownFilterFieldException(filterItem.field);
        }
      }
    }

    if (query.orders && query.orders.length > 0) {
      options.order = {};
      for (const order of query.orders) {
        switch (order.field) {
          case 'createdAt':
          case 'updatedAt':
          case 'browser':
            options.order[order.field] = order.direction === 'ASC' ? 'ASC' : 'DESC';
            break;
          default:
          // nothing
        }
      }
    }

    return new FindAndCountResult(await repo.findAndCount(options));
  }
}
