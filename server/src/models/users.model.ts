import {Document, model, Schema} from 'mongoose';
import {User} from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
  auth0id: {
    type: String,
    required: true,
    unique: true,
  },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
