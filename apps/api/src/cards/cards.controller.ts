import { Body, Controller, ForbiddenException, Headers, Param, Post, UnauthorizedException } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { CardsService } from './cards.service';

class ScanCardDto { @IsString() @IsNotEmpty() cardToken!: string; }
class RedeemDto { @IsString() @IsNotEmpty() redemptionNote!: string; }
class CancelVisitDto { @IsString() @IsNotEmpty() reason!: string; }

@Controller('cards')
export class CardsController {
  constructor(private readonly cards: CardsService) {}

  @Post('scan')
  scan(@Headers('x-tenant-id') tenantId: string, @Body() dto: ScanCardDto) {
    if (!tenantId) throw new UnauthorizedException();
    return this.cards.scan(tenantId, dto.cardToken);
  }

  @Post(':publicId/redeem')
  redeem(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') actorId: string,
    @Param('publicId') publicId: string,
    @Body() dto: RedeemDto,
  ) {
    if (!tenantId || !actorId) throw new UnauthorizedException();
    return this.cards.redeem({ tenantId, actorId, publicId, note: dto.redemptionNote });
  }

  @Post('visits/:visitId/cancel')
  cancelVisit(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') actorId: string,
    @Headers('x-role') role: string,
    @Param('visitId') visitId: string,
    @Body() dto: CancelVisitDto,
  ) {
    if (!tenantId || !actorId) throw new UnauthorizedException();
    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(role)) throw new ForbiddenException('Se requiere autorización de gerente');
    return this.cards.cancelVisit({ tenantId, actorId, visitId, reason: dto.reason });
  }
}

