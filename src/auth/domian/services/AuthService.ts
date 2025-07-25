import jwt from "jsonwebtoken"
import type { UserRepository } from "../../../subscriptions/domain/repositories/UserRepository"
import { AuthUser } from "../entities/AuthUser"
import { ValidationError, UserNotFoundError } from "../../../common/errors/DomainError"

export interface RegisterRequest {
  email: string
  name: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
  }
  token: string
}

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(request: RegisterRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email)
    if (existingUser) {
      throw new ValidationError("User already exists with this email")
    }

    // Create new user
    const userData = await AuthUser.create(request.email, request.name, request.password)
    const user = await this.userRepository.save({
      ...userData,
      freeMessagesUsed: 0,
      freeMessagesResetDate: new Date(),
      needsFreeMessageReset: function () {
        const now = new Date()
        const resetDate = new Date(this.freeMessagesResetDate)
        return now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()
      },
    })

    // Generate JWT token
    const token = this.generateToken(user.id, user.email)

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    }
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    // Find user by email
    const user = await this.userRepository.findByEmail(request.email)
    if (!user) {
      throw new UserNotFoundError("Invalid email or password")
    }

    // For demo user, allow login without password check
    if (user.email === "demo@example.com") {
      const token = this.generateToken(user.id, user.email)
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      }
    }

    // For other users, we'll need to implement proper password checking
    // For now, we'll allow any password for development
    const token = this.generateToken(user.id, user.email)

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    }
  }

  async verifyToken(token: string): Promise<{ userId: string; email: string }> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      return {
        userId: decoded.userId,
        email: decoded.email,
      }
    } catch (error) {
      throw new ValidationError("Invalid or expired token")
    }
  }

  private generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, process.env.JWT_SECRET!, { expiresIn: "7d" })
  }
}
