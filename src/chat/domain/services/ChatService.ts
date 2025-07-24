import type { ChatRepository } from "../repositories/ChatRepository"
import type { SubscriptionRepository } from "../../../subscriptions/domain/repositories/SubscriptionRepository"
import type { UserRepository } from "../../../subscriptions/domain/repositories/UserRepository"
import { Chat } from "../entities/Chat"
import { QuotaExceededError, UserNotFoundError } from "../../../common/errors/DomainError"

export interface ChatRequest {
  userId: string
  question: string
}

export interface ChatResponse {
  chat: Chat
  remainingQuota: {
    freeMessages: number
    bundleMessages: number
    bundleTier?: string
  }
}

export class ChatService {
  constructor(
    private chatRepository: ChatRepository,
    private subscriptionRepository: SubscriptionRepository,
    private userRepository: UserRepository,
  ) {}

  async handleChat(request: ChatRequest): Promise<ChatResponse> {
    const user = await this.userRepository.findById(request.userId)
    if (!user) {
      throw new UserNotFoundError()
    }

    // Check and reset free messages if needed
    await this.checkAndResetFreeMessages(request.userId)

    // Get current usage
    const freeMessagesUsed = await this.chatRepository.countFreeMessagesThisMonth(request.userId)
    const activeBundles = await this.subscriptionRepository.getActiveBundles(request.userId)

    // Find available quota
    let bundleId: string | undefined
    let isFreeMessage = false

    const availableBundle = activeBundles
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      .find((bundle) => bundle.maxMessages === -1 || bundle.usedMessages < bundle.maxMessages)

    if (availableBundle) {
      bundleId = availableBundle.id
    } else if (freeMessagesUsed < 3) {
      isFreeMessage = true
    } else {
      throw new QuotaExceededError("No available message quota. Please upgrade your subscription.")
    }

    // Simulate OpenAI API call
    const { answer, tokens } = await this.simulateOpenAI(request.question)

    // Create and save chat
    const chatData = Chat.create(request.question, answer, tokens, request.userId, bundleId, isFreeMessage)

    const chat = await this.chatRepository.save(chatData)

    // Update usage counters
    if (!isFreeMessage && bundleId) {
      await this.subscriptionRepository.incrementUsage(bundleId, 1)
    }

    // Calculate remaining quota
    const updatedFreeMessages = isFreeMessage ? freeMessagesUsed + 1 : freeMessagesUsed
    const updatedBundles = await this.subscriptionRepository.getActiveBundles(request.userId)
    const bestBundle = updatedBundles.find(
      (bundle) => bundle.maxMessages === -1 || bundle.usedMessages < bundle.maxMessages,
    )

    return {
      chat,
      remainingQuota: {
        freeMessages: 3 - updatedFreeMessages,
        bundleMessages: bestBundle
          ? bestBundle.maxMessages === -1
            ? -1
            : bestBundle.maxMessages - bestBundle.usedMessages
          : 0,
        bundleTier: bestBundle?.tier,
      },
    }
  }

  private async checkAndResetFreeMessages(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId)
    if (!user) return

    const now = new Date()
    const lastReset = new Date(user.freeMessagesResetDate)

    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      await this.userRepository.resetFreeMessages(userId)
    }
  }

  private async simulateOpenAI(question: string): Promise<{ answer: string; tokens: number }> {
    // Simulate API delay (500ms to 2s)
    const delay = Math.random() * 1500 + 500
    await new Promise((resolve) => setTimeout(resolve, delay))

    const responses = [
      "I understand your question. Here's a comprehensive answer based on the latest information available.",
      "That's an interesting question! Let me provide you with a detailed response.",
      "Based on my knowledge, here's what I can tell you about this topic.",
      "Great question! I'll break this down for you in a clear and helpful way.",
      "I'd be happy to help you with that. Here's my analysis of your question.",
    ]

    const answer =
      responses[Math.floor(Math.random() * responses.length)] +
      ` Regarding "${question.substring(0, 50)}${question.length > 50 ? "..." : ""}", ` +
      "this is a simulated response that would normally come from OpenAI's API. " +
      "The actual implementation would integrate with the real OpenAI API to provide intelligent responses."

    const tokens = Math.floor(Math.random() * 100) + 50 // Random tokens between 50-150

    return { answer, tokens }
  }
}
