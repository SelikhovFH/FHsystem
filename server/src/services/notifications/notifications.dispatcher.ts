import { Notification } from "@interfaces/notification.interface";
import { Container, Service } from "typedi";
import { NotificationsSubscriber } from "@services/notifications/notifications.subsriber";
import { EmailSender } from "@services/notifications/email.sender";
import NotificationsService from "@services/notifications/notifications.service";
import UserService from "@services/user.service";
import { Email, EmailTemplates } from "@interfaces/email.interface";
import { getDisplayName } from "@utils/formatters";

@Service()
export class NotificationsDispatcher {
  private notificationSubscriber = Container.get(NotificationsSubscriber);
  private emailSender = Container.get(EmailSender);
  private notificationService = Container.get(NotificationsService);
  private userService = Container.get(UserService);

  async dispatchMultipleNotifications(notification: Omit<Notification, "user" | "_id" | "isRead" | "createdAt">, userIds: string[]) {
    const notificationWithUsers = userIds.map(userId => ({ ...notification, user: userId }));
    const dbNotifications = await this.notificationService.createNotifications(notificationWithUsers);
    this.notificationSubscriber.notifyUsers(dbNotifications);
    // const emails = await Promise.all(dbNotifications.map((notification) => this.notificationToEmail(notification)));
    // this.emailSender.sendEmails(emails);
  }

  async dispatchNotification(notification: Omit<Notification, | "_id" | "isRead" | "createdAt">) {
    const dbNotifications = await this.notificationService.createNotifications([notification]);
    this.notificationSubscriber.notifyUsers(dbNotifications);
    // const emails = await Promise.all(dbNotifications.map((notification) => this.notificationToEmail(notification)));
    // this.emailSender.sendEmails(emails);
  }

  private async notificationToEmail(notification: Notification): Promise<Email> {
    const user = await this.userService.getUserById(notification.user);
    return {
      templateId: EmailTemplates.Notification,
      subject: "New notification",
      to: { email: user.email, name: getDisplayName(user) },
      variables: {
        notification_text: notification.description
      }
    };
  }

  // TODO: remove this method in future when ierarchy will be implemented
  async getEditorIds() {
    return this.userService.getEditorsIds();
  }

  async getAdminIds() {
    return this.userService.getAdminsIds();
  }

}
