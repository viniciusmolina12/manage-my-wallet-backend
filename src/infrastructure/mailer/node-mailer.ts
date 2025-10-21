import nodemailer, { Transporter } from 'nodemailer';
import Mailer from '@core/interfaces/mailer.interface';

export class NodeMailerMailer implements Mailer {
   private readonly transporter: Transporter;
   constructor(config: {
      host: string;
      port: number;
      auth?: { user: string; pass: string };
   }) {
      this.transporter = nodemailer.createTransport(config);
   }
   async sendMail(data: {
      to: string;
      from: string;
      subject: string;
      content: string;
   }): Promise<void> {
      await this.transporter.sendMail({
         to: data.to,
         from: data.from,
         subject: data.subject,
         text: data.content,
      });
   }
}
