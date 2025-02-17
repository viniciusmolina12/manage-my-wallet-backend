
import * as nodemailer from "nodemailer";
import { NodemailerMock } from "nodemailer-mock";
const { mock } = nodemailer as unknown as NodemailerMock;

import { NodeMailerMailer }  from './node-mailer';

describe('NodeMailerMailer', () => {
    let mailer: NodeMailerMailer;

    beforeEach(() => {
        mailer = new NodeMailerMailer({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: '41e0bfdfac4eaa',
                pass: '80529bb2e09534'
            }
        });
        // Substitui o transporter real pelo mock
        // (mailer as any).transporter = nodemailer.createTransport();
    });

    it('should send an email with the correct parameters', async () => {
        const mailData = {
            to: 'viniciusgranmolina@gmail.com',
            from: 'viniciusgranmolina@gmail.com',
            subject: 'Test Email',
            content: 'This is a test email.'
        };
        console.log('PELO MENOS CHEGOU AQUI!')

        await expect(mailer.sendMail(mailData)).resolves.toBeUndefined();

        const sentMail = mock.getSentMail()
        expect(sentMail.length).toBe(1);
        expect(sentMail[0]).toMatchObject({
            to: mailData.to,
            from: mailData.from,
            subject: mailData.subject,
            text: mailData.content
        });
    });
});
