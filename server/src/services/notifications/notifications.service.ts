import notificationModel from "@models/notification.model";
import { Notification } from "@interfaces/notification.interface";
import { Service } from "typedi";

@Service()
class NotificationsService {
  public notification = notificationModel;

  public async createNotification(data: Omit<Notification, "_id" | "isRead" | "createdAt">): Promise<Notification> {
    return this.notification.create(data);
  }

  public async createNotifications(data: Omit<Notification, "_id" | "isRead" | "createdAt">[]): Promise<Notification[]> {
    return this.notification.insertMany(data);
  }

  public async getNotificationById(notificationId: string): Promise<Notification> {
    return this.notification.findById(notificationId);
  }

  public async getUserNotifications(userId: string) {
    return this.notification.find({ user: userId }).sort({ createdAt: -1 }).limit(50);
  }

  public async getUnreadUserNotifications(userId: string) {
    return this.notification.find({ user: userId, isRead: false }).sort({ createdAt: -1 });
  }

  public async markNotificationAsRead(notificationId: string) {
    return this.notification.findByIdAndUpdate(notificationId, { isRead: true });
  }

  public async markAllNotificationsAsRead(userId: string) {
    return this.notification.updateMany({ user: userId }, { isRead: true });
  }

}

export default NotificationsService;
