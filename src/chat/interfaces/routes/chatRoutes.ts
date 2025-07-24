import { Router } from "express"
import type { ChatController } from "../controllers/ChatController"
import { validateBody } from "@/common/middleware/validation"
import { z } from "zod"

const chatRequestSchema = z.object({
  userId: z.string().uuid(),
  question: z.string().min(1).max(1000),
})

const chatQuerySchema = z.object({
  userId: z.string().uuid(),
  limit: z.string().optional(),
})

export function createChatRoutes(chatController: ChatController): Router {
  const router = Router()

  router.post("/ask", validateBody(chatRequestSchema), (req, res, next) => chatController.ask(req, res, next))

  router.get("/history", (req, res, next) => chatController.getHistory(req, res, next))

  return router
}
