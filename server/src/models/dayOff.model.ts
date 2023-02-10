import { Document, model, Schema } from "mongoose";
import { DayOff, DayOffStatus, DayOffType } from "@interfaces/dayOff.interface";

const dayOffSchema: Schema = new Schema({
  startDate: Date,
  finishDate: Date,
  userId: Schema.Types.ObjectId,
  approvedById: String,
  dayCount: Number,
  status: {
    type: String,
    enum: Object.values(DayOffStatus),
    default: "pending"
  },
  type: {
    type: String,
    enum: Object.values(DayOffType),
    default: "pending"
  },
});
const dayOffModel = model<DayOff & Document>('DayOff', dayOffSchema);

export default dayOffModel;
