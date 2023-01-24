import {CreateDayOffDto} from "@dtos/dayOff.dto";
import dayOffModel from "@models/dayOff.model";
import {DayOff, DayOffStatus} from "@interfaces/dayOff.interface";

class DayOffService {
  public dayOff = dayOffModel;

  public async createDayOff(data: CreateDayOffDto): Promise<DayOff> {
    return this.dayOff.create(data);
  }

  public async getPendingDaysOff(): Promise<DayOff[]> {
    return this.dayOff.find({status: DayOffStatus.pending});
  }

  public async getUserDaysOff(userId: string): Promise<DayOff[]> {
    return this.dayOff.find({userId});
  }

}

export default DayOffService;
