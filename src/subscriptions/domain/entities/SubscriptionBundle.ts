export type Tier = "BASIC" | "PRO" | "ENTERPRISE"
export type BillingCycle = "MONTHLY" | "YEARLY"

export class SubscriptionBundle {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly tier: Tier,
    public readonly maxMessages: number,
    public readonly usedMessages: number,
    public readonly price: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly renewalDate: Date | null,
    public readonly billingCycle: BillingCycle,
    public readonly autoRenew: boolean,
    public readonly active: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    userId: string,
    tier: Tier,
    billingCycle: BillingCycle,
    autoRenew = true,
  ): {
    userId: string
    tier: Tier
    maxMessages: number
    usedMessages: number
    price: number
    startDate: Date
    endDate: Date
    renewalDate: Date | null
    billingCycle: BillingCycle
    autoRenew: boolean
    active: boolean
  } {
    const tierConfig = {
      BASIC: { maxMessages: 10, monthlyPrice: 9.99, yearlyPrice: 99.99 },
      PRO: { maxMessages: 100, monthlyPrice: 29.99, yearlyPrice: 299.99 },
      ENTERPRISE: { maxMessages: -1, monthlyPrice: 99.99, yearlyPrice: 999.99 },
    }

    const config = tierConfig[tier]
    const price = billingCycle === "YEARLY" ? config.yearlyPrice : config.monthlyPrice

    const startDate = new Date()
    const endDate = new Date()
    if (billingCycle === "YEARLY") {
      endDate.setFullYear(endDate.getFullYear() + 1)
    } else {
      endDate.setMonth(endDate.getMonth() + 1)
    }

    return {
      userId,
      tier,
      maxMessages: config.maxMessages,
      usedMessages: 0,
      price,
      startDate,
      endDate,
      renewalDate: endDate,
      billingCycle,
      autoRenew,
      active: true,
    }
  }

  hasRemainingMessages(): boolean {
    return this.maxMessages === -1 || this.usedMessages < this.maxMessages
  }

  isExpired(): boolean {
    return new Date() > this.endDate
  }

  needsRenewal(): boolean {
    return this.autoRenew && this.renewalDate !== null && new Date() >= this.renewalDate
  }
}
