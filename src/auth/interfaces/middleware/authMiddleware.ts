import type { Request, Response, NextFunction } from "express"
import { PrismaUserRepository } from "../../../subscriptions/infrastructure/repositories/PrismaUserRepository"
import { ValidationError } from "../../../common/errors/DomainError"
import { AuthService } from "@/auth/domian/services/AuthService"

const userRepository = new PrismaUserRepository()
const authService = new AuthService(userRepository)

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      throw new ValidationError("Access token required")
    }

    const decoded = await authService.verifyToken(token)
    const user = await userRepository.findById(decoded.userId)

    if (!user) {
      throw new ValidationError("User not found")
    }
    // Attach user to request
    ;(req as any).user = user
    next()
  } catch (error) {
    next(error)
  }
}

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (token) {
      const decoded = await authService.verifyToken(token)
      const user = await userRepository.findById(decoded.userId)
      ;(req as any).user = user
    }

    next()
  } catch (error) {
    // For optional auth, we don't throw errors
    next()
  }
}
