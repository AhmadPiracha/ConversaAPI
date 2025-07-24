import * as cron from "node-cron"
import type { SubscriptionService } from "@/subscriptions/domain/services/SubscriptionService"

export class Scheduler {
  constructor(private subscriptionService: SubscriptionService) {}

  start(): void {
    // Run renewal process daily at 2 AM
    cron.schedule("0 2 * * *", async () => {
      console.log("Running subscription renewals...")
      try {
        await this.subscriptionService.renewSubscriptions()
        console.log("Subscription renewals completed successfully")
      } catch (error) {
        console.error("Error during subscription renewals:", error)
      }
    })

    console.log("Scheduler started")
  }
}
