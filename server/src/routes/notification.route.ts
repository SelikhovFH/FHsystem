import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import NotificationController from "@controllers/notification.controller";
import { MarkNotificationAsReadDto } from "@dtos/notification.dto";

class NotificationsRoute implements Routes {
  public path = "/notifications";
  public router = Router();
  public notificationController = new NotificationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.notificationController.getUserNotifications);
    this.router.get(`${this.path}/unread`, this.notificationController.getUnreadUserNotifications);
    this.router.patch(`${this.path}/all`, this.notificationController.markAllNotificationsAsRead);
    this.router.patch(`${this.path}/:id`, validationMiddleware(MarkNotificationAsReadDto, "params"), this.notificationController.markNotificationAsRead);
    this.router.get(`${this.path}/subscribe`, this.notificationController.subscribe);
  }
}

export default NotificationsRoute;
