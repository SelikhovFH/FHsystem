import { User } from "@interfaces/user.interface";
import userModel from "@models/user.model";
import { UpdateUserAdminDto } from "@dtos/user.dto";
import mongoose from "mongoose";
import { Service } from "typedi";

@Service()
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
      .lookup({
        from: "skilltags",
        foreignField: "_id",
        localField: "skills",
        as: "skills"
      })
      .exec();
    return res[0];
  }

  public async getUsers() {
    return this.user.find().select("+salaryHistory").populate("skills");
  }

  public getUserById(_id: string) {
    return this.user.findById(_id).select("+salaryHistory").populate("skills");
  }

  public async getUsersDisplayInfo(): Promise<{ _id: string; name: string; surname: string; email: string }[]> {
    return this.user.find().select("name surname email");
  }

  public async getUserDisplayInfoById(_id: string): Promise<{ _id: string; name: string; surname: string; email: string }> {
    return this.user.findOne({ _id }).select("name surname email");
  }

  public async getEditorsIds(): Promise<string[]> {
    return this.user.find({ role: { $in: ["editor", "admin"] } }).select("_id").then(res => res.map(r => r._id.toString()));
  }

  public async getAdminsIds(): Promise<string[]> {
    return this.user.find({ role: "admin" }).select("_id").then(res => res.map(r => r._id.toString()));
  }

}

export default UserService;
