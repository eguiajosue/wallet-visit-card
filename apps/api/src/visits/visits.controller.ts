import { Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { RegisterVisitDto } from './register-visit.dto';
import { VisitsService } from './visits.service';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visits: VisitsService) {}

  @Post()
  register(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: RegisterVisitDto,
  ) {
    // El gateway de producción reemplaza estos headers por claims firmados.
    if (!tenantId || !userId) throw new UnauthorizedException();
    return this.visits.register({ tenantId, actorId: userId, ...dto });
  }
}

