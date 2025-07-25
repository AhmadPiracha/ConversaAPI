import { prisma } from "@/core/database/prisma"

describe("Test setup", () => {
  afterAll(async () => {
    // Ensure prisma disconnects after all tests
    await prisma.$disconnect()
  })

  it("should have a prisma instance defined", () => {
    expect(prisma).toBeDefined()
  })

  it("should be able to connect and disconnect to the database", async () => {
    // Try a simple query to check connection
    const result = await prisma.$queryRaw`SELECT 1`
    expect(result).toBeDefined()
    // Disconnect handled in afterAll
  })
})