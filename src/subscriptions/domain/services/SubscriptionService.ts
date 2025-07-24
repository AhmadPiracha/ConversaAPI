import type { SubscriptionRepository } from "../repositories/SubscriptionRepository"
import type { UserRepository } from "../repositories/UserRepository"
import { SubscriptionBundle, type Tier, type BillingCycle } from "../entities/SubscriptionBundle"
import { SubscriptionNotFoundError, UserNotFoundError, PaymentFailedError } from "@/common/errors/DomainError"

export interface CreateSubscriptionRequest {
  userId: string
  tier: Tier
  billingCycle: BillingCycle
  autoRenew?: boolean
}

export class SubscriptionService {
  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private userRepository: UserRepository,
  ) {}

  async createBundle(request: CreateSubscriptionRequest): Promise<SubscriptionBundle> {
    const user = await this.userRepository.findById(request.userId)
    if (!user) {
      throw new UserNotFoundError()
    }

    // Simulate payment processing
    const paymentSuccess = await this.simulatePayment()
    if (!paymentSuccess) {
      throw new PaymentFailedError()
    }

    const bundleData = SubscriptionBundle.create(request.userId, request.tier, request.billingCycle, request.autoRenew)

    return await this.subscriptionRepository.save(bundleData)
  }

  async getUserSubscriptions(userId: string): Promise<SubscriptionBundle[]> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new UserNotFoundError()
    }

    return await this.subscriptionRepository.getActiveBundles(userId)
  }

  async toggleAutoRenew(bundleId: string, autoRenew: boolean): Promise<void> {
    const bundle = await this.subscriptionRepository.findById(bundleId)
    if (!bundle) {
      throw new SubscriptionNotFoundError()
    }

    await this.subscriptionRepository.updateAutoRenew(bundleId, autoRenew)
  }

  async cancelBundle(bundleId: string): Promise<void> {
    const bundle = await this.subscriptionRepository.findById(bundleId)
    if (!bundle) {
      throw new SubscriptionNotFoundError()
    }

    await this.subscriptionRepository.cancelAtPeriodEnd(bundleId)
  }

  async renewSubscriptions(): Promise<void> {
    const renewableBundles = await this.subscriptionRepository.getRenewableBundles()

    for (const bundle of renewableBundles) {
      try {
        const paymentSuccess = await this.simulatePayment()

        if (paymentSuccess) {
          const newEndDate = new Date(bundle.endDate)
          if (bundle.billingCycle === "YEARLY") {
            newEndDate.setFullYear(newEndDate.getFullYear() + 1)
          } else {
            newEndDate.setMonth(newEndDate.getMonth() + 1)
          }

          await this.subscriptionRepository.renew(bundle.id, newEndDate)
        } else {
          // Payment failed, mark as inactive
          await this.subscriptionRepository.markInactive(bundle.id)
        }
      } catch (error) {
        console.error(`Failed to renew subscription ${bundle.id}:`, error)
        await this.subscriptionRepository.markInactive(bundle.id)
      }
    }
  }

  private async simulatePayment(): Promise<boolean> {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 90% success rate for payments
    return Math.random() > 0.1
  }
}
