import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      name: "John Doe",
      freeMessagesUsed: 1,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      email: "jane@example.com",
      name: "Jane Smith",
      freeMessagesUsed: 0,
    },
  })

  // Create sample subscription bundles
  const now = new Date()
  const endDate = new Date(now)
  endDate.setMonth(endDate.getMonth() + 1)

  await prisma.subscriptionBundle.upsert({
    where: { id: "bundle-1" },
    update: {},
    create: {
      id: "bundle-1",
      userId: user1.id,
      tier: "PRO",
      maxMessages: 100,
      usedMessages: 25,
      price: 29.99,
      startDate: now,
      endDate: endDate,
      renewalDate: endDate,
      billingCycle: "MONTHLY",
      autoRenew: true,
    },
  })

  await prisma.subscriptionBundle.upsert({
    where: { id: "bundle-2" },
    update: {},
    create: {
      id: "bundle-2",
      userId: user2.id,
      tier: "BASIC",
      maxMessages: 10,
      usedMessages: 5,
      price: 9.99,
      startDate: now,
      endDate: endDate,
      renewalDate: endDate,
      billingCycle: "MONTHLY",
      autoRenew: true,
    },
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
