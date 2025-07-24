import type { SubscriptionBundle } from "../entities/SubscriptionBundle"

export interface SubscriptionRepository {
  save(bundle: {
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
  }): Promise<SubscriptionBundle>
  findById(id: string): Promise<SubscriptionBundle | null>
  getActiveBundles(userId: string): Promise<SubscriptionBundle[]>
  getRenewableBundles(): Promise<SubscriptionBundle[]>
  incrementUsage(bundleId: string, amount: number): Promise<void>
  markInactive(bundleId: string): Promise<void>
  renew(bundleId: string, newEndDate: Date): Promise<void>
  cancelAtPeriodEnd(bundleId: string): Promise<void>
  updateAutoRenew(bundleId: string, autoRenew: boolean): Promise<void>
}
