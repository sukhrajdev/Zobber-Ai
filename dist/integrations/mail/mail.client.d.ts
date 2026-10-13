import type { MailClientConfig, RawSendMailOptions, SendMailSuccessResponse } from "./mail.types.js";
import "dotenv/config";
/**
 * MailClient manages the low-level Nodemailer SMTP connection,
 * connection verification, and raw message transmission.
 */
export declare class MailClient {
    private transporter;
    private config;
    constructor();
    /**
     * Initializes or reconfigures the transporter from environment variables
     */
    initFromEnv(): void;
    /**
     * Manually configures the mail transporter
     */
    configure(config: MailClientConfig): void;
    /**
     * Checks whether the mail client is currently configured
     */
    isConfigured(): boolean;
    /**
     * Performs an SMTP handshake to verify connection and credentials
     */
    verifyConnection(): Promise<boolean>;
    /**
     * Sends an email message through the SMTP transporter
     */
    sendMail(options: RawSendMailOptions): Promise<SendMailSuccessResponse>;
}
declare const _default: MailClient;
export default _default;
//# sourceMappingURL=mail.client.d.ts.map