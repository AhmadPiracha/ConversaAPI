import type { Request, Response, NextFunction } from "express"
import type { ZodSchema } from "zod"
import { ValidationError } from "../errors/DomainError"

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      next(new ValidationError("Invalid request body"))
    }
  }
}

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query)
      next()
    } catch (error) {
      next(new ValidationError("Invalid query parameters"))
    }
  }
}
