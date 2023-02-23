import { Document, model, Schema } from "mongoose";
import { TimeTrack } from "@interfaces/timeTrack.interface";

const timeTrackSchema: Schema = new Schema({
  userId: Schema.Types.ObjectId,
  date: Date,
  hours: Number,
  projectId: Schema.Types.ObjectId,
  isMonthTrack: Boolean,
  comment: String
});
const timeTrackModel = model<TimeTrack & Document>("TimeTrack", timeTrackSchema);

export default timeTrackModel;
