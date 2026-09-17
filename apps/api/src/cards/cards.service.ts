import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CardStatus, Prisma, VisitStatus } from '@prisma/client';
import { createHmac } from 'node:crypto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CardsService {
  constructor(private readonly db: PrismaService) {}

  async scan(tenantId: string, token: string) {
    const card = await this.db.loyaltyCard.findFirst({
      where: { tenantId, tokenHash: this.hash(token) },
      include: {
        campaign: { select: { name: true, visitGoal: true, expiresAt: true } },
        visits: { where: { status: VisitStatus.CONFIRMED }, orderBy: { createdAt: 'desc' },
          select: { id: true, ticketNumber: true, purchaseCents: true, createdAt: true, branch: { select: { name: true } } } },
        rewardGrant: { include: { reward: { select: { name: true, description: true } } } },
      },
    });
    if (!card) throw new NotFoundException('Tarjeta no encontrada');
    return {
      card: { id: card.publicId, status: card.status, visitCount: card.visitCount,
        visitGoal: card.campaign.visitGoal, expiresAt: card.expiresAt },
      campaign: { name: card.campaign.name },
      reward: card.rewardGrant?.reward ?? null,
      visits: card.visits.map((visit) => ({ id: visit.id, ticketNumber: visit.ticketNumber,
        purchaseCents: visit.purchaseCents, branch: visit.branch.name, registeredAt: visit.createdAt })),
    };
  }

  redeem(input: { tenantId: string; actorId: string; publicId: string; note: string }) {
    return this.db.$transaction(async (tx) => {
      const card = await tx.loyaltyCard.findFirst({
        where: { tenantId: input.tenantId, publicId: input.publicId }, include: { rewardGrant: true },
      });
      if (!card) throw new NotFoundException('Tarjeta no encontrada');
      if (card.status !== CardStatus.REWARD_EARNED || !card.rewardGrant) {
        throw new ConflictException('La tarjeta no tiene una recompensa pendiente');
      }
      const redeemedAt = new Date();
      await tx.rewardGrant.update({ where: { id: card.rewardGrant.id }, data: { redeemedAt, redeemedById: input.actorId } });
      await tx.loyaltyCard.update({ where: { id: card.id }, data: { status: CardStatus.COMPLETED } });
      await tx.auditEvent.create({ data: { tenantId: input.tenantId, actorId: input.actorId,
        action: 'reward.redeemed', entityType: 'LoyaltyCard', entityId: card.id,
        metadata: { rewardGrantId: card.rewardGrant.id, note: input.note } } });
      return { cardId: card.publicId, status: CardStatus.COMPLETED, redeemedAt };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  cancelVisit(input: { tenantId: string; actorId: string; visitId: string; reason: string }) {
    if (input.reason.trim().length < 5) throw new BadRequestException('Explica el motivo de cancelación');
    return this.db.$transaction(async (tx) => {
      const visit = await tx.visit.findFirst({ where: { id: input.visitId, tenantId: input.tenantId }, include: { card: true } });
      if (!visit) throw new NotFoundException('Visita no encontrada');
      if (visit.status === VisitStatus.CANCELLED) return { visitId: visit.id, status: visit.status };
      if (visit.card.status !== CardStatus.ACTIVE) throw new ConflictException('No se puede cancelar después de asignar una recompensa');
      await tx.visit.update({ where: { id: visit.id }, data: { status: VisitStatus.CANCELLED,
        cancelledAt: new Date(), cancellationReason: input.reason.trim() } });
      await tx.loyaltyCard.update({ where: { id: visit.cardId }, data: { visitCount: { decrement: 1 } } });
      await tx.auditEvent.create({ data: { tenantId: input.tenantId, actorId: input.actorId,
        action: 'visit.cancelled', entityType: 'Visit', entityId: visit.id,
        metadata: { reason: input.reason.trim(), cardId: visit.cardId } } });
      return { visitId: visit.id, status: VisitStatus.CANCELLED };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  private hash(token: string) {
    const secret = process.env.TOKEN_HASH_SECRET;
    if (!secret) throw new Error('TOKEN_HASH_SECRET is required');
    return createHmac('sha256', secret).update(token).digest('hex');
  }
}
