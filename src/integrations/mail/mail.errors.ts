/**
 * Base error class for mail integration failures
 */
export class MailClientError extends Error {
  constructor(message: string, public readonly code?: string, public readonly details?: any) {
    super(message);
    this.name = "MailClientError";
  }
}

/**
 * Thrown when connection or authentication to the SMTP server fails
 */
export class SmtpConnectionError extends MailClientError {
  constructor(message: string, code?: string, details?: any) {
    super(`SMTP Connection Failed: ${message}`, code, details);
    this.name = "SmtpConnectionError";
  }
}

/**
 * Thrown when dispatching an individual message fails or is rejected
 */
export class MailDeliveryError extends MailClientError {
  constructor(message: string, code?: string, details?: any) {
    super(`Mail Delivery Failed: ${message}`, code, details);
    this.name = "MailDeliveryError";
  }
}
