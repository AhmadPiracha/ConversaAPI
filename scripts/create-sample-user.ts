import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function createSampleUser() {
  try {
    const user = await prisma.user.upsert({
      where: { email: "demo@example.com" },
      update: {},
      create: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        email: "demo@example.com",
        name: "Demo User",
        freeMessagesUsed: 0,
      },
    })

    console.log("Sample user created:", user)
  } catch (error) {
    console.error("Error creating sample user:", error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleUser()
