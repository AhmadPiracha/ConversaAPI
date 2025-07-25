import { Router } from "express"
import type { AuthController } from "../controllers/AuthController"
import { validateBody } from "../../../common/middleware/validation"
import { authenticateToken } from "../middleware/authMiddleware"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  password: z.string().min(6).max(100),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router()

  router.post("/register", validateBody(registerSchema), (req, res, next) => authController.register(req, res, next))

  router.post("/login", validateBody(loginSchema), (req, res, next) => authController.login(req, res, next))

  router.get("/me", authenticateToken, (req, res, next) => authController.me(req, res, next))

  return router
}
