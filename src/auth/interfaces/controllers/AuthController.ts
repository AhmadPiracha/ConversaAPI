import { AuthService } from "@/auth/domian/services/AuthService"
import type { Request, Response, NextFunction } from "express"

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, name, password } = req.body

      const result = await this.authService.register({ email, name, password })

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body

      const result = await this.authService.login({ email, password })

      res.json({
        success: true,
        message: "Login successful",
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // User info is attached by auth middleware
      const user = (req as any).user

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
      })
    } catch (error) {
      next(error)
    }
  }
}
