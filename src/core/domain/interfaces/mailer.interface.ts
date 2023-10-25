export default interface Mailer {
    sendMail(data: { to: string, from: string, subject: string, content: string}): Promise<void>
}