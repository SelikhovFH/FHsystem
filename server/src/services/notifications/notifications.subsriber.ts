import { Notification } from "@/interfaces/notification.interface";
import { Service } from "typedi";

@Service()
export class NotificationsSubscriber {
  private subscribedUsers: ([string, Function])[] = [];


  subscribeUser = (userId: string, notify: Function) => {
    this.subscribedUsers.push([userId, notify]);
  };

  unsubscribeUser = (userId: string) => {
    this.subscribedUsers = this.subscribedUsers.filter(([id, _]) => id !== userId);
  };

  notifyUsers = (notification: Notification, userIds: string[]) => {
    this.subscribedUsers.forEach(([id, notify]) => {
      if (userIds.includes(id)) {
        notify(notification);
      }
    });
  };
}
