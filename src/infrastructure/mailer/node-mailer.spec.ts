import * as nodemailer from 'nodemailer';
import { NodemailerMock } from 'nodemailer-mock';
import { NodeMailerMailer } from './node-mailer';
const { mock } = nodemailer as unknown as NodemailerMock;
describe('NodeMailerMailer', () => {
   let mailer: NodeMailerMailer;

   beforeEach(() => {
      mailer = new NodeMailerMailer({
         host: 'sandbox.smtp.mailtrap.io',
         port: 2525,
         auth: {
            user: '41e0bfdfac4eaa',
            pass: '80529bb2e09534',
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

      const sentMail = mock.getSentMail();
      expect(sentMail.length).toBe(1);
      expect(sentMail[0]).toMatchObject({
         to: mailData.to,
         from: mailData.from,
         subject: mailData.subject,
         text: mailData.content,
      });
   });
});
