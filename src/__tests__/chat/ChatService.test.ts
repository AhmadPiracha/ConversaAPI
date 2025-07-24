import { ChatService } from "@/chat/domain/services/ChatService"
import { PrismaChatRepository } from "@/chat/infrastructure/repositories/PrismaChatRepository"
import { PrismaSubscriptionRepository } from "@/subscriptions/infrastructure/repositories/PrismaSubscriptionRepository"
import { PrismaUserRepository } from "@/subscriptions/infrastructure/repositories/PrismaUserRepository"
import { QuotaExceededError, UserNotFoundError } from "@/common/errors/DomainError"
import jest from "jest"

describe("ChatService", () => {
  let chatService: ChatService
  let chatRepository: PrismaChatRepository
  let subscriptionRepository: PrismaSubscriptionRepository
  let userRepository: PrismaUserRepository

  beforeEach(() => {
    chatRepository = new PrismaChatRepository()
    subscriptionRepository = new PrismaSubscriptionRepository()
    userRepository = new PrismaUserRepository()
    chatService = new ChatService(chatRepository, subscriptionRepository, userRepository)
  })

  describe("handleChat", () => {
    it("should throw UserNotFoundError when user does not exist", async () => {
      jest.spyOn(userRepository, "findById").mockResolvedValue(null)

      await expect(chatService.handleChat({ userId: "non-existent", question: "test" })).rejects.toThrow(
        UserNotFoundError,
      )
    })

    it("should use free message when available", async () => {
      // Mock user with available free messages
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        freeMessagesUsed: 1,
        freeMessagesResetDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      jest.spyOn(userRepository, "findById").mockResolvedValue(mockUser)
      jest.spyOn(chatRepository, "countFreeMessagesThisMonth").mockResolvedValue(1)
      jest.spyOn(subscriptionRepository, "getActiveBundles").mockResolvedValue([])
      jest.spyOn(chatRepository, "save").mockResolvedValue({
        id: "chat-1",
        question: "test",
        answer: "test answer",
        tokens: 50,
        userId: "user-1",
        isFreeMessage: true,
        createdAt: new Date(),
      })

      const result = await chatService.handleChat({ userId: "user-1", question: "test" })

      expect(result.chat.isFreeMessage).toBe(true)
      expect(result.remainingQuota.freeMessages).toBe(2)
    })

    it("should throw QuotaExceededError when no quota available", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        freeMessagesUsed: 3,
        freeMessagesResetDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      jest.spyOn(userRepository, "findById").mockResolvedValue(mockUser)
      jest.spyOn(chatRepository, "countFreeMessagesThisMonth").mockResolvedValue(3)
      jest.spyOn(subscriptionRepository, "getActiveBundles").mockResolvedValue([])

      await expect(chatService.handleChat({ userId: "user-1", question: "test" })).rejects.toThrow(QuotaExceededError)
    })
  })
})
