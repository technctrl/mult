import nodemailer, { Transporter } from 'nodemailer';
import { renderFile } from 'twig';
import path from 'path';
import 'dotenv/config';
import { consoleLogger } from '@main/@types/Logger/infrastructure/ConsoleLogger';

class NodeMailerService {
  private static transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  public static async verifyTransport(): Promise<void> {
    try {
      await this.transporter.verify();
      consoleLogger.log('Transporter verified successfully');
    } catch (error) {
      // console.error('Error verifying transporter:', error);
      throw new Error('Transporter verification failed');
    }
  }

  private static async renderTemplate(
    templateName: string,
    context: Record<string, unknown>
  ): Promise<string> {
    const templatePath = path.resolve(
      __dirname,
      '../../../../templates/notifications/mail',
      `${templateName}.twig`
    );
    return new Promise((resolve, reject) => {
      renderFile(templatePath, context, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  public static async sendMail(
    to: string,
    subject: string,
    templateName: string,
    context: Record<string, unknown>,
    from: string = process.env.MAIL_FROM || 'default@example.com'
  ): Promise<void> {

    const body = await this.renderTemplate(templateName, context);

    const mailOptions = {
      from,
      to,
      subject,
      html: body,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Mail sent successfully');
    } catch (error) {
      console.error('Error sending mail:', error);
    }
  }
}

export default NodeMailerService;
