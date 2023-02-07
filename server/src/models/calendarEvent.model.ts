import { Document, model, Schema } from "mongoose";
import { CalendarEvent } from "@interfaces/calendarEvent.interface";

const calendarEventSchema: Schema = new Schema({
  createdBy: String,
  title: String,
  description: String,
  date: Date,
  isDayOff: Boolean,
  isRecurring: Boolean
});
const calendarEventModel = model<CalendarEvent & Document>("CalendarEvent", calendarEventSchema);

export default calendarEventModel;
