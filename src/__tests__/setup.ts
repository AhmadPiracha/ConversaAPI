// Test setup file
import { prisma } from "@/core/database/prisma"
import { beforeAll, afterAll, beforeEach } from "@jest/globals"

beforeAll(async () => {
  // Setup test database
})

afterAll(async () => {
  await prisma.$disconnect()
})

beforeEach(async () => {
  // Clean up before each test
})
