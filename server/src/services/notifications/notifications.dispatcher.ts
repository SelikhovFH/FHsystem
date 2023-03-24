import { Notification } from "@interfaces/notification.interface";

export class NotificationsDispatcher {
  dispatchNotification(notification: Notification) {

  }

  dispatchNotificationToMultipleUsers(notification: Omit<Notification, "userId">, userIds: string[]) {

  }

  subscribeSseListener(listener: unknown) {

  }

  unsubscribeSseListener(listener: unknown) {

  }

}
