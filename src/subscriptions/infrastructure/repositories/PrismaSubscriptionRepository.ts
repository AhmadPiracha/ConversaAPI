import type { SubscriptionRepository } from "../../domain/repositories/SubscriptionRepository"
import { SubscriptionBundle } from "../../domain/entities/SubscriptionBundle"
import { prisma } from "../../../core/database/prisma"

export class PrismaSubscriptionRepository implements SubscriptionRepository {
  async save(bundleData: {
    userId: string
    tier: any
    maxMessages: number
    usedMessages: number
    price: number
    startDate: Date
    endDate: Date
    renewalDate: Date | null
    billingCycle: any
    autoRenew: boolean
    active: boolean
  }): Promise<SubscriptionBundle> {
    const savedBundle = await prisma.subscriptionBundle.create({
      data: {
        userId: bundleData.userId,
        tier: bundleData.tier,
        maxMessages: bundleData.maxMessages,
        usedMessages: bundleData.usedMessages,
        price: bundleData.price,
        startDate: bundleData.startDate,
        endDate: bundleData.endDate,
        renewalDate: bundleData.renewalDate,
        billingCycle: bundleData.billingCycle,
        autoRenew: bundleData.autoRenew,
        active: bundleData.active,
      },
    })

    return new SubscriptionBundle(
      savedBundle.id,
      savedBundle.userId,
      savedBundle.tier as any,
      savedBundle.maxMessages,
      savedBundle.usedMessages,
      Number(savedBundle.price),
      savedBundle.startDate,
      savedBundle.endDate,
      savedBundle.renewalDate,
      savedBundle.billingCycle as any,
      savedBundle.autoRenew,
      savedBundle.active,
      savedBundle.createdAt,
      savedBundle.updatedAt,
    )
  }

  async findById(id: string): Promise<SubscriptionBundle | null> {
    const bundle = await prisma.subscriptionBundle.findUnique({
      where: { id },
    })

    if (!bundle) return null

    return new SubscriptionBundle(
      bundle.id,
      bundle.userId,
      bundle.tier as any,
      bundle.maxMessages,
      bundle.usedMessages,
      Number(bundle.price),
      bundle.startDate,
      bundle.endDate,
      bundle.renewalDate,
      bundle.billingCycle as any,
      bundle.autoRenew,
      bundle.active,
      bundle.createdAt,
      bundle.updatedAt,
    )
  }

  async getActiveBundles(userId: string): Promise<SubscriptionBundle[]> {
    const bundles = await prisma.subscriptionBundle.findMany({
      where: {
        userId,
        active: true,
      },
      orderBy: {
        endDate: "desc",
      },
    })

    return bundles.map(
      (bundle) =>
        new SubscriptionBundle(
          bundle.id,
          bundle.userId,
          bundle.tier as any,
          bundle.maxMessages,
          bundle.usedMessages,
          Number(bundle.price),
          bundle.startDate,
          bundle.endDate,
          bundle.renewalDate,
          bundle.billingCycle as any,
          bundle.autoRenew,
          bundle.active,
          bundle.createdAt,
          bundle.updatedAt,
        ),
    )
  }

  async getRenewableBundles(): Promise<SubscriptionBundle[]> {
    const bundles = await prisma.subscriptionBundle.findMany({
      where: {
        active: true,
        autoRenew: true,
        renewalDate: {
          lte: new Date(),
        },
      },
    })

    return bundles.map(
      (bundle) =>
        new SubscriptionBundle(
          bundle.id,
          bundle.userId,
          bundle.tier as any,
          bundle.maxMessages,
          bundle.usedMessages,
          Number(bundle.price),
          bundle.startDate,
          bundle.endDate,
          bundle.renewalDate,
          bundle.billingCycle as any,
          bundle.autoRenew,
          bundle.active,
          bundle.createdAt,
          bundle.updatedAt,
        ),
    )
  }

  async incrementUsage(bundleId: string, amount: number): Promise<void> {
    await prisma.subscriptionBundle.update({
      where: { id: bundleId },
      data: {
        usedMessages: {
          increment: amount,
        },
      },
    })
  }

  async markInactive(bundleId: string): Promise<void> {
    await prisma.subscriptionBundle.update({
      where: { id: bundleId },
      data: {
        active: false,
        autoRenew: false,
      },
    })
  }

  async renew(bundleId: string, newEndDate: Date): Promise<void> {
    const newRenewalDate = new Date(newEndDate)

    await prisma.subscriptionBundle.update({
      where: { id: bundleId },
      data: {
        endDate: newEndDate,
        renewalDate: newRenewalDate,
        usedMessages: 0, // Reset usage for new period
      },
    })
  }

  async cancelAtPeriodEnd(bundleId: string): Promise<void> {
    await prisma.subscriptionBundle.update({
      where: { id: bundleId },
      data: {
        autoRenew: false,
      },
    })
  }

  async updateAutoRenew(bundleId: string, autoRenew: boolean): Promise<void> {
    await prisma.subscriptionBundle.update({
      where: { id: bundleId },
      data: {
        autoRenew,
      },
    })
  }
}
