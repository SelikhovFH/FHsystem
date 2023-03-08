import { Document, model, Schema } from "mongoose";
import { Client } from "@interfaces/client.interface";

const clientSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: String,
  website: String,
  additionalContacts: String,
  workStartDate: Date
});

const projectModel = model<Client & Document>("Client", clientSchema);

export default projectModel;
