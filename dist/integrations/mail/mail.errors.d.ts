/**
 * Base error class for mail integration failures
 */
export declare class MailClientError extends Error {
    readonly code?: string | undefined;
    readonly details?: any;
    constructor(message: string, code?: string | undefined, details?: any);
}
/**
 * Thrown when connection or authentication to the SMTP server fails
 */
export declare class SmtpConnectionError extends MailClientError {
    constructor(message: string, code?: string, details?: any);
}
/**
 * Thrown when dispatching an individual message fails or is rejected
 */
export declare class MailDeliveryError extends MailClientError {
    constructor(message: string, code?: string, details?: any);
}
//# sourceMappingURL=mail.errors.d.ts.map