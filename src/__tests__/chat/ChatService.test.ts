import { ChatService } from "../../chat/domain/services/ChatService"
import { PrismaChatRepository } from "../../chat/infrastructure/repositories/PrismaChatRepository"
import { PrismaSubscriptionRepository } from "../../subscriptions/infrastructure/repositories/PrismaSubscriptionRepository"
import { QuotaExceededError, UserNotFoundError } from "../../common/errors/DomainError"
import { User } from "../../subscriptions/domain/entities/User"

describe("ChatService", () => {
  let chatService: ChatService
  let chatRepository: PrismaChatRepository
  let subscriptionRepository: PrismaSubscriptionRepository
  let userRepository: any

  beforeEach(() => {
    chatRepository = new PrismaChatRepository()
    subscriptionRepository = new PrismaSubscriptionRepository()
    userRepository = { findById: jest.fn() } // mock only needed methods
    chatService = new ChatService(chatRepository, subscriptionRepository, userRepository)
  })

  describe("handleChat", () => {
    it("should throw UserNotFoundError when user does not exist", async () => {
      userRepository.findById.mockResolvedValue(null)

      await expect(chatService.handleChat({ userId: "non-existent", question: "test" })).rejects.toThrow(
        UserNotFoundError,
      )
    })

    it("should use free message when available", async () => {
      const mockUser = new User(
        "user-1",
        "test@example.com",
        "Test User",
        1,
        new Date(Date.now() - 1000 * 60 * 60 * 24), // yesterday
        new Date(),
        new Date()
      )

      userRepository.findById.mockResolvedValue(mockUser)
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
      expect(result.remainingQuota.freeMessages).toBe(1)
    })

    it("should throw QuotaExceededError when no quota available", async () => {
      const mockUser = new User(
        "user-1",
        "test@example.com",
        "Test User",
        3,
        new Date(Date.now() - 1000 * 60 * 60 * 24),
        new Date(),
        new Date()
      )

      userRepository.findById.mockResolvedValue(mockUser)
      jest.spyOn(chatRepository, "countFreeMessagesThisMonth").mockResolvedValue(3)
      jest.spyOn(subscriptionRepository, "getActiveBundles").mockResolvedValue([])

      await expect(chatService.handleChat({ userId: "user-1", question: "test" })).rejects.toThrow(
        QuotaExceededError
      )
    })
  })
})
