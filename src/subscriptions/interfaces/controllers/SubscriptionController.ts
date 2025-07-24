import type { Request, Response, NextFunction } from "express"
import type { SubscriptionService } from "@/subscriptions/domain/services/SubscriptionService"

export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, tier, billingCycle, autoRenew } = req.body

      const bundle = await this.subscriptionService.createBundle({
        userId,
        tier,
        billingCycle,
        autoRenew,
      })

      res.json({
        success: true,
        data: bundle,
      })
    } catch (error) {
      next(error)
    }
  }

  async getUserSubscriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.query

      const subscriptions = await this.subscriptionService.getUserSubscriptions(userId as string)

      res.json({
        success: true,
        data: subscriptions,
      })
    } catch (error) {
      next(error)
    }
  }

  async toggleAutoRenew(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { autoRenew } = req.body

      await this.subscriptionService.toggleAutoRenew(id, autoRenew)

      res.json({
        success: true,
        message: `Auto-renew ${autoRenew ? "enabled" : "disabled"}`,
      })
    } catch (error) {
      next(error)
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      await this.subscriptionService.cancelBundle(id)

      res.json({
        success: true,
        message: "Subscription cancelled successfully",
      })
    } catch (error) {
      next(error)
    }
  }
}
