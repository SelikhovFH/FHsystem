import { Document, model, Schema } from "mongoose";
import { Notification, NotificationType } from "@interfaces/notification.interface";

const notificationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  type: { type: String, enum: Object.values(NotificationType), default: NotificationType.info },
  isRead: Boolean,
  link: String,
  event: String
});
const notificationModel = model<Notification & Document>("Notification", notificationSchema);

export default notificationModel;
