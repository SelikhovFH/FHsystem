import {Document, model, Schema} from 'mongoose';
import {Delivery, DeliveryStatus} from "@interfaces/delivery.interface";

const deliverySchema: Schema = new Schema({
  status: {
    type: String,
    enum: Object.values(DeliveryStatus),
  },
  deliverToId: String,
  deliveryCode: String,
  itemId: String,
  deviceId: String,
  customItem: String,
  description: String,
  estimatedDeliveryTime: Date
});
const deliveryModel = model<Delivery & Document>('Delivery', deliverySchema);

export default deliveryModel;
