import { Document, model, Schema } from "mongoose";
import { Device, DeviceType } from "@interfaces/device.interface";

const deviceSchema: Schema = new Schema({
  name: String,
  type: {
    type: String,
    enum: Object.values(DeviceType)
  },
  screenSize: Number,
  cpu: String,
  ram: Number,
  storage: Number,
  serialNumber: String,
  owner: String,
  assignedToId: Schema.Types.ObjectId,
  notes: String
});
const deviceModel = model<Device & Document>('Device', deviceSchema);

export default deviceModel;
