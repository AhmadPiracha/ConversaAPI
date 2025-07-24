export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
  ) {
    super(message)
    this.name = "DomainError"
  }
}

export class QuotaExceededError extends DomainError {
  constructor(message = "Message quota exceeded") {
    super(message, "QUOTA_EXCEEDED", 429)
  }
}

export class SubscriptionNotFoundError extends DomainError {
  constructor(message = "Subscription not found") {
    super(message, "SUBSCRIPTION_NOT_FOUND", 404)
  }
}

export class UserNotFoundError extends DomainError {
  constructor(message = "User not found") {
    super(message, "USER_NOT_FOUND", 404)
  }
}

export class PaymentFailedError extends DomainError {
  constructor(message = "Payment processing failed") {
    super(message, "PAYMENT_FAILED", 402)
  }
}

export class ValidationError extends DomainError {
  constructor(message = "Validation failed") {
    super(message, "VALIDATION_ERROR", 400)
  }
}
