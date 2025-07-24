import type { Chat } from "../entities/Chat"

export interface ChatRepository {
  save(chat: Omit<Chat, "id" | "createdAt">): Promise<Chat>
  findByUserId(userId: string, limit?: number): Promise<Chat[]>
  countMonthlyChats(userId: string): Promise<number>
  countFreeMessagesThisMonth(userId: string): Promise<number>
}
