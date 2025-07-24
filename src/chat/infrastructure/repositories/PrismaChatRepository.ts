import type { ChatRepository } from "../../domain/repositories/ChatRepository"
import { Chat } from "../../domain/entities/Chat"
import { prisma } from "../../../core/database/prisma"

export class PrismaChatRepository implements ChatRepository {
  async save(chatData: Omit<Chat, "id" | "createdAt">): Promise<Chat> {
    const savedChat = await prisma.chat.create({
      data: {
        question: chatData.question,
        answer: chatData.answer,
        tokens: chatData.tokens,
        userId: chatData.userId,
        bundleId: chatData.bundleId,
        isFreeMessage: chatData.isFreeMessage,
      },
    })

    return new Chat(
      savedChat.id,
      savedChat.question,
      savedChat.answer,
      savedChat.tokens,
      savedChat.userId,
      savedChat.bundleId || undefined,
      savedChat.isFreeMessage,
      savedChat.createdAt,
    )
  }

  async findByUserId(userId: string, limit = 50): Promise<Chat[]> {
    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return chats.map(
      (chat) =>
        new Chat(
          chat.id,
          chat.question,
          chat.answer,
          chat.tokens,
          chat.userId,
          chat.bundleId || undefined,
          chat.isFreeMessage,
          chat.createdAt,
        ),
    )
  }

  async countMonthlyChats(userId: string): Promise<number> {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    return await prisma.chat.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    })
  }

  async countFreeMessagesThisMonth(userId: string): Promise<number> {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    return await prisma.chat.count({
      where: {
        userId,
        isFreeMessage: true,
        createdAt: {
          gte: startOfMonth,
        },
      },
    })
  }
}
