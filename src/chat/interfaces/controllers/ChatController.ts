import type { Request, Response, NextFunction } from "express"
import type { ChatService } from "@/chat/domain/services/ChatService"

export class ChatController {
  constructor(private chatService: ChatService) {}

  async ask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, question } = req.body

      const result = await this.chatService.handleChat({ userId, question })

      res.json({
        success: true,
        data: {
          message: {
            id: result.chat.id,
            question: result.chat.question,
            answer: result.chat.answer,
            tokens: result.chat.tokens,
            isFreeMessage: result.chat.isFreeMessage,
            createdAt: result.chat.createdAt,
          },
          remainingQuota: result.remainingQuota,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.query
      const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 20

      // This would use the chat repository directly or through a service
      // For now, we'll implement it in the service
      res.json({
        success: true,
        data: [], // TODO: Implement getHistory in ChatService
      })
    } catch (error) {
      next(error)
    }
  }
}
