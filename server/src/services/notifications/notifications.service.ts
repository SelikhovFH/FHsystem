import notificationModel from "@models/notification.model";
import { Notification } from "@interfaces/notification.interface";

class NotificationsService {
  public notification = notificationModel;

  public async createNotification(data: Notification): Promise<Notification> {
    return this.notification.create(data);
  }

  public async getNotificationById(notificationId: string): Promise<Notification> {
    return this.notification.findById(notificationId);
  }

  public async getUserNotifications(userId: string) {
    return this.notification.find({ user: userId });
  }

  public async getUnreadUserNotifications(userId: string) {
    return this.notification.find({ user: userId, isRead: false });
  }

  public async markNotificationAsRead(notificationId: string) {
    return this.notification.findByIdAndUpdate(notificationId, { isRead: true });
  }

}

export default NotificationsService;
