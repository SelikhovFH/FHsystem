import { User } from "@interfaces/user.interface";
import userModel from "@models/user.model";
import { UpdateUserAdminDto } from "@dtos/user.dto";
import mongoose from "mongoose";

class UserService {
  public user = userModel;

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
    return this.user
      .aggregate()
      .match({
        _id: new mongoose.Types.ObjectId(userId)
      })
      .project({
        _id: 1,
        auth0id: 1,
        email: 1,
        role: 1,
        name: 1,
        surname: 1,
        workStartDate: 1,
        phone: 1,
        emergencyContact: 1,
        location: 1,
        title: 1,
        cvLink: 1,
        status: 1,
        salaryHistory: 1,
        birthDate: 1
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
      .lookup({
        from: "deliveries",
        as: "deliveries",
        localField: "_id",
        foreignField: "deliverToId"
      })
      .exec();
  }

  public async getUsers() {
    return this.user.find().select("+salaryHistory");
  }

  public async getUsersDisplayInfo() {
    return this.user.find().select("name surname email");
  }
}

export default UserService;
