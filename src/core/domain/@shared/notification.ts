export type NotificationType = {
    source: string;
    message: string
}
export default class Notification {
    private readonly notifications: NotificationType[] = [];

    add(notification: NotificationType) {
        this.notifications.push(notification)
    }

    getNotifications(source?: string): string {
        let message = "";
        this.notifications.map(notification => {
            if(source === undefined || notification.source === source) {
                message += `${notification.source}: ${notification.message}, `
            }
        })
        return message;
    }

    hasErrors(): boolean {
        console.log('CAIU AQUIA')
        return this.notifications.length > 0;
    }

}