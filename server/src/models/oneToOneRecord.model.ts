import { Document, model, Schema } from "mongoose";
import { OneToOneRecord } from "@interfaces/oneToOneRecord.interface";
import { User } from "@interfaces/user.interface";

const oneToOneRecordSchema: Schema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  date: Date,
  notes: String,
  impression: Number
});

const oneToOneRecordModel = model<OneToOneRecord & Document>("oneToOneRecord", oneToOneRecordSchema);

export default oneToOneRecordModel;
