import nodemailer from 'nodemailer';
import { NodeMailerMailer } from './node-mailer';

jest.mock('nodemailer');

describe('NodeMailerMailer', () => {
   let mailer: NodeMailerMailer;

   beforeEach(() => {
      jest.clearAllMocks();

      mailer = new NodeMailerMailer({
         host: 'sandbox.smtp.mailtrap.io',
         port: 2525,
         auth: {
            user: 'user',
            pass: 'pass',
         },
      });
   });

   it('should send an email with the correct parameters', async () => {
      const mailData = {
         to: 'viniciusgranmolina@gmail.com',
         from: 'viniciusgranmolina@gmail.com',
         subject: 'Test Email',
         content: 'This is a test email.',
      };

      await expect(mailer.sendMail(mailData)).resolves.toBeUndefined();

      const { sendMailMock } = nodemailer as unknown as {
         sendMailMock: jest.Mock;
      };

      expect(sendMailMock).toHaveBeenCalledTimes(1);
      expect(sendMailMock).toHaveBeenCalledWith(
         expect.objectContaining({
            to: mailData.to,
            from: mailData.from,
            subject: mailData.subject,
            text: mailData.content,
         })
      );
   });
});
