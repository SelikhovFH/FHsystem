import deviceModel from "@models/device.model";
import {CreateDeviceDto, UpdateDeviceDto} from "@dtos/device.dto";
import {Device} from "@interfaces/device.interface";

class DeviceService {
  private device = deviceModel;

  public async createItem(data: CreateDeviceDto): Promise<Device> {
    return this.device.create(data);
  }

  public async updateDevice(_id: string, data: Partial<UpdateDeviceDto>): Promise<Device> {
    return this.device.findOneAndUpdate({_id}, data);
  }

  public async deleteDevice(_id: string) {
    return this.device.findOneAndDelete({_id})
  }

  public async getDevices(): Promise<Device[]> {
    return this.device.find()
  }

}

export default DeviceService;
