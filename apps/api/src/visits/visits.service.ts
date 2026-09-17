import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CardStatus, Prisma, VisitStatus } from '@prisma/client';
import { createHmac, randomInt } from 'node:crypto';
import { PrismaService } from '../prisma.service';

type RegisterInput = {
  tenantId: string; actorId: string; cardToken: string; branchId: string;
  ticketNumber: string; purchaseCents: number; idempotencyKey: string;
};

@Injectable()
export class VisitsService {
  constructor(private readonly db: PrismaService) {}

  async register(input: RegisterInput) {
    const tokenHash = createHmac('sha256', this.requiredSecret()).update(input.cardToken).digest('hex');
    try {
      return await this.db.$transaction(async (tx) => {
        const replay = await tx.visit.findUnique({
          where: { tenantId_idempotencyKey: { tenantId: input.tenantId, idempotencyKey: input.idempotencyKey } },
          include: { card: { include: { rewardGrant: { include: { reward: true } } } } },
        });
        if (replay) return this.response(replay.card, replay);

        const card = await tx.loyaltyCard.findFirst({
          where: { tenantId: input.tenantId, tokenHash },
          include: { campaign: { include: { rewards: { where: { active: true } } } } },
        });
        if (!card) throw new NotFoundException('Tarjeta no encontrada');
        if (card.status !== CardStatus.ACTIVE) throw new ConflictException('La tarjeta ya no acepta visitas');
        if (card.expiresAt <= new Date()) throw new BadRequestException('La tarjeta ha caducado');
        if (input.purchaseCents < card.campaign.minimumPurchaseCents) {
          throw new BadRequestException('La compra no alcanza el monto mínimo');
        }

        const lastVisit = await tx.visit.findFirst({
          where: { cardId: card.id, status: VisitStatus.CONFIRMED }, orderBy: { createdAt: 'desc' },
        });
        if (lastVisit) {
          const nextAllowed = new Date(lastVisit.createdAt.getTime() + card.campaign.cooldownMinutes * 60_000);
          if (nextAllowed > new Date()) throw new ConflictException(`Nueva visita permitida después de ${nextAllowed.toISOString()}`);
        }

        const visit = await tx.visit.create({ data: {
          tenantId: input.tenantId, cardId: card.id, branchId: input.branchId,
          registeredById: input.actorId, ticketNumber: input.ticketNumber.trim(),
          purchaseCents: input.purchaseCents, idempotencyKey: input.idempotencyKey,
        }});
        const count = card.visitCount + 1;
        const completed = count >= card.campaign.visitGoal;
        const updated = await tx.loyaltyCard.update({
          where: { id: card.id },
          data: { visitCount: count, status: completed ? CardStatus.REWARD_EARNED : CardStatus.ACTIVE },
        });

        let reward = null;
        if (completed) {
          const selected = this.selectReward(card.campaign.rewards);
          if (!selected) throw new ConflictException('La campaña no tiene premios disponibles');
          if (selected.inventory !== null) {
            const changed = await tx.campaignReward.updateMany({
              where: { id: selected.id, inventory: { gt: 0 } }, data: { inventory: { decrement: 1 } },
            });
            if (changed.count !== 1) throw new ConflictException('El premio se agotó; intenta nuevamente');
          }
          reward = await tx.rewardGrant.create({
            data: { cardId: card.id, rewardId: selected.id }, include: { reward: true },
          });
        }
        await tx.auditEvent.create({ data: {
          tenantId: input.tenantId, actorId: input.actorId, action: 'visit.created',
          entityType: 'Visit', entityId: visit.id,
          metadata: { cardId: card.id, branchId: input.branchId, count, rewardId: reward?.rewardId ?? null },
        }});
        return { cardId: updated.publicId, visitId: visit.id, visitCount: count,
          visitGoal: card.campaign.visitGoal, status: updated.status,
          reward: reward ? { id: reward.reward.id, name: reward.reward.name } : null };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('El ticket o la operación ya fue registrado');
      }
      throw error;
    }
  }

  private selectReward<T extends { weight: number; inventory: number | null }>(rewards: T[]): T | null {
    const available = rewards.filter((reward) => reward.weight > 0 && (reward.inventory === null || reward.inventory > 0));
    const total = available.reduce((sum, reward) => sum + reward.weight, 0);
    if (!total) return null;
    let cursor = randomInt(total);
    return available.find((reward) => ((cursor -= reward.weight) < 0)) ?? null;
  }

  private response(card: { publicId: string; visitCount: number; status: CardStatus; rewardGrant?: { reward: { id: string; name: string } } | null }, visit: { id: string }) {
    return { cardId: card.publicId, visitId: visit.id, visitCount: card.visitCount,
      status: card.status, reward: card.rewardGrant ? { id: card.rewardGrant.reward.id, name: card.rewardGrant.reward.name } : null,
      idempotentReplay: true };
  }

  private requiredSecret() {
    const secret = process.env.TOKEN_HASH_SECRET;
    if (!secret) throw new Error('TOKEN_HASH_SECRET is required');
    return secret;
  }
}

