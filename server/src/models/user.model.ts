import { Document, model, Schema } from "mongoose";
import { User, UserRole, UserStatus } from "@interfaces/user.interface";

const userSchema: Schema = new Schema({
  auth0id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  workStartDate: Date,
  phone: String,
  emergencyContact: String,
  location: String,
  title: String,
  cvLink: String,
  status: {
    type: String,
    enum: Object.values(UserStatus)
  },
  salaryHistory: {
    type: [{ value: Number, date: Date }],
    select: false
  },
  birthDate: Date

});

const userModel = model<User & Document>("User", userSchema);

export default userModel;
