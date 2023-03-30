import { NextFunction, Request, Response } from "express";
import NotificationsService from "@services/notifications/notifications.service";
import { HttpException } from "@exceptions/HttpException";
import { Notification } from "@interfaces/notification.interface";
import { Container } from "typedi";
import { NotificationsSubscriber } from "@services/notifications/notifications.subsriber";
import { v4 } from "uuid";

class NotificationController {
  private notificationService = new NotificationsService();

  notificationsSubscriber = Container.get(NotificationsSubscriber);

  getUserNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      const notifications = await this.notificationService.getUserNotifications(userId);
      res.status(200).json({ data: notifications, message: "ok" });
    } catch (error) {
      next(error);
    }
  };

  getUnreadUserNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      const notifications = await this.notificationService.getUnreadUserNotifications(userId);
      res.status(200).json({ data: notifications, message: "ok" });
    } catch (error) {
      next(error);
    }
  };

  markNotificationAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notificationId = req.params.id;
      const userId = req.auth.payload.db_id as string;
      const foundNotification = await this.notificationService.getNotificationById(notificationId);
      if (foundNotification.user.toString() !== userId) {
        throw new HttpException(403, "You can't read notifications of other users");
      }
      const notification = await this.notificationService.markNotificationAsRead(notificationId);
      res.status(200).json({ data: notification, message: "ok" });
    } catch (error) {
      next(error);
    }
  };
  markAllNotificationsAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      const notifications = await this.notificationService.markAllNotificationsAsRead(userId);
      res.status(200).json({ data: notifications, message: "ok" });
    } catch (error) {
      next(error);
    }
  };

  subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      });

      const notifyUser = async (notification: Notification) => {
        res.write(`id: ${v4()}\ndata: ${JSON.stringify(notification)}\n\n`);
        res.flush();
      };

      this.notificationsSubscriber.subscribeUser(userId, notifyUser);

      req.on("close", () => {
        this.notificationsSubscriber.unsubscribeUser(userId);
      });
    } catch (error) {
      next(error);
    }
  };
}

export default NotificationController;
