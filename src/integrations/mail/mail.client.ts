import nodemailer, { type Transporter } from "nodemailer";
import type { MailClientConfig, RawSendMailOptions, SendMailSuccessResponse } from "./mail.types.js";
import { SmtpConnectionError, MailDeliveryError } from "./mail.errors.js";
import "dotenv/config";

/**
 * MailClient manages the low-level Nodemailer SMTP connection,
 * connection verification, and raw message transmission.
 */
export class MailClient {
  private transporter: Transporter | null = null;
  private config: MailClientConfig | null = null;

  constructor() {
    this.initFromEnv();
  }

  /**
   * Initializes or reconfigures the transporter from environment variables
   */
  public initFromEnv(): void {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.EMAIL_FROM || user || "";
    const secure = process.env.SMTP_SECURE === "true" || port === 465;

    if (host && user && pass) {
      this.configure({
        host,
        port,
        secure,
        auth: { user, pass },
        from
      });
    }
  }

  /**
   * Manually configures the mail transporter
   */
  public configure(config: MailClientConfig): void {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  /**
   * Checks whether the mail client is currently configured
   */
  public isConfigured(): boolean {
    return this.transporter !== null && this.config !== null;
  }

  /**
   * Performs an SMTP handshake to verify connection and credentials
   */
  public async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      throw new SmtpConnectionError("Transporter has not been configured. Check your SMTP environment variables.");
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error: any) {
      throw new SmtpConnectionError(error.message, error.code, error);
    }
  }

  /**
   * Sends an email message through the SMTP transporter
   */
  public async sendMail(options: RawSendMailOptions): Promise<SendMailSuccessResponse> {
    if (!this.transporter || !this.config) {
      throw new SmtpConnectionError("Cannot send email: Transporter is not configured.");
    }

    try {
      const fromAddress = options.from || this.config.from;
      const result = await this.transporter.sendMail({
        from: fromAddress,
        to: options.to,
        subject: options.subject,
        text: options.text,
        ...(options.html ? { html: options.html } : {})
      });

      return {
        accepted: Array.isArray(result.accepted) ? result.accepted.map(String) : [],
        rejected: Array.isArray(result.rejected) ? result.rejected.map(String) : [],
        messageId: result.messageId,
        response: result.response ?? ""
      };
    } catch (error: any) {
      throw new MailDeliveryError(error.message, error.code, error);
    }
  }
}

export default new MailClient();
