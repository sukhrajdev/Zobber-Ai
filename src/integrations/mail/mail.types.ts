import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

/**
 * Credentials for SMTP authentication
 */
export interface SmtpAuthCredentials {
  user: string;
  pass: string;
}

/**
 * Configuration for the MailClient SMTP Transporter
 */
export interface MailClientConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: SmtpAuthCredentials;
  from: string;
  tls?: SMTPTransport.Options["tls"];
}

/**
 * Options for sending an individual email
 */
export interface RawSendMailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
}

/**
 * Response returned from a successful Nodemailer dispatch
 */
export interface SendMailSuccessResponse {
  accepted: string[];
  rejected: string[];
  messageId: string;
  response: string;
}
