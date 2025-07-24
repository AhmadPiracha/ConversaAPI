import { Router } from "express"
import type { SubscriptionController } from "../controllers/SubscriptionController"
import { validateBody } from "@/common/middleware/validation"
import { z } from "zod"

const createSubscriptionSchema = z.object({
  userId: z.string().uuid(),
  tier: z.enum(["BASIC", "PRO", "ENTERPRISE"]),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]),
  autoRenew: z.boolean().optional(),
})

const toggleAutoRenewSchema = z.object({
  autoRenew: z.boolean(),
})

export function createSubscriptionRoutes(subscriptionController: SubscriptionController): Router {
  const router = Router()

  router.post("/", validateBody(createSubscriptionSchema), (req, res, next) =>
    subscriptionController.create(req, res, next),
  )

  router.get("/", (req, res, next) => subscriptionController.getUserSubscriptions(req, res, next))

  router.patch("/:id/auto-renew", validateBody(toggleAutoRenewSchema), (req, res, next) =>
    subscriptionController.toggleAutoRenew(req, res, next),
  )

  router.delete("/:id", (req, res, next) => subscriptionController.cancel(req, res, next))

  return router
}
