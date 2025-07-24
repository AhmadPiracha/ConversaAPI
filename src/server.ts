import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { errorHandler } from "./common/middleware/errorHandler"
import { createChatRoutes } from "./chat/interfaces/routes/chatRoutes"
import { createSubscriptionRoutes } from "./subscriptions/interfaces/routes/subscriptionRoutes"
import { ChatController } from "./chat/interfaces/controllers/ChatController"
import { SubscriptionController } from "./subscriptions/interfaces/controllers/SubscriptionController"
import { ChatService } from "./chat/domain/services/ChatService"
import { SubscriptionService } from "./subscriptions/domain/services/SubscriptionService"
import { PrismaChatRepository } from "./chat/infrastructure/repositories/PrismaChatRepository"
import { PrismaSubscriptionRepository } from "./subscriptions/infrastructure/repositories/PrismaSubscriptionRepository"
import { PrismaUserRepository } from "./subscriptions/infrastructure/repositories/PrismaUserRepository"
import { Scheduler } from "./core/scheduler/scheduler"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Serve static files from public directory
app.use(express.static("public"))

// Dependency Injection
const chatRepository = new PrismaChatRepository()
const subscriptionRepository = new PrismaSubscriptionRepository()
const userRepository = new PrismaUserRepository()

const chatService = new ChatService(chatRepository, subscriptionRepository, userRepository)
const subscriptionService = new SubscriptionService(subscriptionRepository, userRepository)

const chatController = new ChatController(chatService)
const subscriptionController = new SubscriptionController(subscriptionService)

// Routes
app.use("/api/chat", createChatRoutes(chatController))
app.use("/api/subscriptions", createSubscriptionRoutes(subscriptionController))

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorHandler)

// Start scheduler
const scheduler = new Scheduler(subscriptionService)
scheduler.start()

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`)
  console.log(`💳 Subscriptions API: http://localhost:${PORT}/api/subscriptions`)
  console.log(`🌐 Frontend: http://localhost:${PORT}`)
})

export default app
