import { User } from "@interfaces/user.interface";
import userModel from "@models/user.model";
import { UpdateUserAdminDto } from "@dtos/user.dto";
import mongoose from "mongoose";

class UserService {
  public user = userModel;

  public static GET_PUBLIC_PROJECTION = (field: string) => ({
    [`${field}.auth0id`]: 0,
    [`${field}.role`]: 0,
    [`${field}.workStartDate`]: 0,
    [`${field}.phone`]: 0,
    [`${field}.emergencyContact`]: 0,
    [`${field}.location`]: 0,
    [`${field}.title`]: 0,
    [`${field}.cvLink`]: 0,
    [`${field}.status`]: 0,
    [`${field}.salaryHistory`]: 0,
    [`${field}.birthDate`]: 0
  });

  public async createUser(data: Partial<User>): Promise<User> {
    return this.user.create(data);
  }

  public async updateUser(_id: string, data: Partial<UpdateUserAdminDto>): Promise<User> {
    return this.user.findOneAndUpdate({ _id }, data);
  }

  public async deleteUser(_id: string) {
    return this.user.findOneAndDelete({ _id });
  }

  public async getUserProfile(userId: string) {
    const res = await this.user
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
    return res[0];
  }

  public async getUsers() {
    return this.user.find().select("+salaryHistory");
  }

  public async getUsersDisplayInfo() {
    return this.user.find().select("name surname email");
  }
}

export default UserService;
