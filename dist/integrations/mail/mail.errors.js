/**
 * Base error class for mail integration failures
 */
export class MailClientError extends Error {
    code;
    details;
    constructor(message, code, details) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = "MailClientError";
    }
}
/**
 * Thrown when connection or authentication to the SMTP server fails
 */
export class SmtpConnectionError extends MailClientError {
    constructor(message, code, details) {
        super(`SMTP Connection Failed: ${message}`, code, details);
        this.name = "SmtpConnectionError";
    }
}
/**
 * Thrown when dispatching an individual message fails or is rejected
 */
export class MailDeliveryError extends MailClientError {
    constructor(message, code, details) {
        super(`Mail Delivery Failed: ${message}`, code, details);
        this.name = "MailDeliveryError";
    }
}
//# sourceMappingURL=mail.errors.js.map