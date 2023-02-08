import deviceModel from "@models/device.model";
import { CreateDeviceDto, UpdateDeviceDto } from "@dtos/device.dto";
import { Device } from "@interfaces/device.interface";
import userService from "@services/user.service";

class DeviceService {
  private device = deviceModel;

  public async createItem(data: CreateDeviceDto): Promise<Device> {
    return this.device.create(data);
  }

  public async updateDevice(_id: string, data: Partial<UpdateDeviceDto>, force?: boolean): Promise<Device> {
    if (force) {
      return this.device.findOneAndReplace({ _id }, data);
    }
    return this.device.findOneAndUpdate({ _id }, data);
  }

  public async deleteDevice(_id: string) {
    return this.device.findOneAndDelete({ _id });
  }

  public async getDeviceById(_id: string) {
    return this.device.findOne({ _id });
  }

  public async getDevices(): Promise<Device[]> {
    return this.device
      .aggregate()
      .lookup({
        from: "users",
        as: "assignedToUser",
        localField: "assignedToId",
        foreignField: "_id"
      })
      .unwind({
        path: "$assignedToUser",
        preserveNullAndEmptyArrays: true
      })
      .project(userService.GET_PUBLIC_PROJECTION("assignedToUser"))
      .exec();
  }
}

export default DeviceService;
