import { Document, model, Schema } from "mongoose";
import { User } from "@interfaces/user.interface";

//Domain specific information should be stored in mongo. Other non specific info (email, avatar, password, etc) is handled by auth0
const userSchema: Schema = new Schema({
  auth0id: {
    type: String,
    required: true,
    unique: true
  }
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
