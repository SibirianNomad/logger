import { HasRoleMode } from '@app/crypto-finance/domain/auth/enums/has-role-mode';
import { RoleCodeBase } from '@app/crypto-finance/domain/auth/enums/role-code.base';
import { Page } from '@app/crypto-finance/domain/value-object/repository/page';
import { wrongRequestApiResource } from '@app/crypto-finance/infrastructure/documentation/wrong-request-api-response';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { UseCustomGuards } from '../../shared/decorators/use-custom-guards.decorator';
import { LogListQuery } from '../dto/query/log-list.query';
import { LogInfoListDto } from '../dto/response/log-info-list.dto';
import { Permission } from '../enums/permission.enum';
import { Route } from '../enums/route';
import { LoggerAdminService } from '../services/logger-admin.service';

@ApiTags('admin')
@Controller('logger')
export class LoggerAdminController {
  constructor(private readonly loggerAdminService: LoggerAdminService) {}

  @ApiOperation({
    summary: `admin: show logs by userId`,
  })
  @ApiBody({ type: LogListQuery })
  @ApiResponse({ type: LogInfoListDto })
  @ApiResponse(wrongRequestApiResource)
  @ApiBearerAuth()
  @UseCustomGuards(JwtAuthGuard, 'HasPermissionGuard', 'HasRoleGuard', {
    roles: [RoleCodeBase.OPERATOR, RoleCodeBase.ADMIN, RoleCodeBase.SUPER_ADMIN],
    mode: HasRoleMode.ANY_OF,
    permissions: [Permission.GET_LOG_LIST_ADMIN],
  })
  @Post(Route.GET_LOG_LIST_ADMIN)
  async list(@Body() query: LogListQuery) {
    return await this.loggerAdminService.list(new Page(query.page, query.take || 20), query);
  }
}
