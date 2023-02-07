import { User } from "@interfaces/user.interface";
import userModel from "@models/user.model";
import { RegisterUserDto, UpdateUserAdminDto } from "@dtos/user.dto";
import mongoose from "mongoose";

class UserService {
  public user = userModel;

  public async createUser(data: RegisterUserDto & { _id: string }): Promise<User> {
    return this.user.create(data);
  }

  public async updateUser(_id: string, data: Partial<UpdateUserAdminDto>): Promise<User> {
    return this.user.findOneAndUpdate({ _id }, data);
  }

  public async deleteUser(_id: string) {
    return this.user.findOneAndDelete({ _id });
  }

  public async getUserProfile(userId: string) {
    return this.user
      .aggregate()
      .match({
        _id: new mongoose.Types.ObjectId(userId)
      })
      .lookup({
        from: "devices",
        as: "devices",
        localField: "_id",
        foreignField: "assignedToId"
      })
      .lookup({
        from: "dayoffs",
        as: "daysOff",
        localField: "_id",
        foreignField: "userId"
      })
      .exec();
  }

  public async getUsers() {
    return this.user.find();
  }

  public async getUsersDisplayInfo() {
    return this.user.find().select("name surname email");
  }
}

export default UserService;
