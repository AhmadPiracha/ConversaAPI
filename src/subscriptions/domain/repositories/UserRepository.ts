import type { User } from "../entities/User"

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  save(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>
  resetFreeMessages(userId: string): Promise<void>
}
