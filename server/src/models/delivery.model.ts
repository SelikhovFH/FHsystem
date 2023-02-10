import { Document, model, Schema } from "mongoose";
import { Delivery, DeliveryStatus } from "@interfaces/delivery.interface";

const deliverySchema: Schema = new Schema({
  status: {
    type: String,
    enum: Object.values(DeliveryStatus)
  },
  deliverToId: Schema.Types.ObjectId,
  deliveryCode: String,
  itemId: Schema.Types.ObjectId,
  deviceId: Schema.Types.ObjectId,
  customItem: String,
  description: String,
  estimatedDeliveryTime: Date
});
const deliveryModel = model<Delivery & Document>('Delivery', deliverySchema);

export default deliveryModel;
