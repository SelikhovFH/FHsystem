import { Notification } from "@/interfaces/notification.interface";
import { Service } from "typedi";
import * as console from "console";

@Service()
export class NotificationsSubscriber {
  private subscribedUsers: ([string, Function])[] = [];


  subscribeUser = (userId: string, notify: Function) => {
    console.log("subscribed user", userId);
    this.subscribedUsers.push([userId, notify]);
  };

  unsubscribeUser = (userId: string) => {
    this.subscribedUsers = this.subscribedUsers.filter(([id, _]) => id !== userId);
  };

  notifyUsers = (notifications: Notification[]) => {
    console.log("notify users", notifications);
    this.subscribedUsers.forEach(([id, notify]) => {
      const userNotification = notifications.find(notification => notification.user.toString() === id);
      if (userNotification) {
        console.log("userNotification", userNotification);
        notify(userNotification);
      }
    });
  };
}
