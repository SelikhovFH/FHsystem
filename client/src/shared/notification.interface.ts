export interface Notification {
  _id: string;
  user: string;
  title: string;
  description?: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  link?: string;
  event?: string;
}

export enum NotificationType {
  info = "info",
  warning = "warning",
  error = "error",
}
