import type { UserRepository } from "../../../subscriptions/domain/repositories/UserRepository"
import { User } from "../../../subscriptions/domain/entities/User"
import { prisma } from "../../../core/database/prisma"

export class PrismaAuthUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) return null

    return new User(
      user.id,
      user.email,
      user.name,
      user.freeMessagesUsed,
      user.freeMessagesResetDate,
      user.createdAt,
      user.updatedAt,
    )
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) return null

    return new User(
      user.id,
      user.email,
      user.name,
      user.freeMessagesUsed,
      user.freeMessagesResetDate,
      user.createdAt,
      user.updatedAt,
    )
  }

  async save(userData: {
    email: string
    name: string
    passwordHash?: string
    freeMessagesUsed: number
    freeMessagesResetDate: Date
  }): Promise<User> {
    const savedUser = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        freeMessagesUsed: userData.freeMessagesUsed,
        freeMessagesResetDate: userData.freeMessagesResetDate,
      },
    })

    return new User(
      savedUser.id,
      savedUser.email,
      savedUser.name,
      savedUser.freeMessagesUsed,
      savedUser.freeMessagesResetDate,
      savedUser.createdAt,
      savedUser.updatedAt,
    )
  }

  async resetFreeMessages(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        freeMessagesUsed: 0,
        freeMessagesResetDate: new Date(),
      },
    })
  }
}
