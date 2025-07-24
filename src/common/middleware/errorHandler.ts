import type { Request, Response, NextFunction } from "express"
import { DomainError } from "../errors/DomainError"

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", error)

  if (error instanceof DomainError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    })
  }

  // Handle Prisma errors
  if (error.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "Database operation failed",
      },
    })
  }

  // Default error
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  })
}
