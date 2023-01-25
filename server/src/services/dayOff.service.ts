import {CreateDayOffWithUserIdDto} from "@dtos/dayOff.dto";
import dayOffModel from "@models/dayOff.model";
import {DayOff, DayOffStatus} from "@interfaces/dayOff.interface";

class DayOffService {
  public dayOff = dayOffModel;

  public async createDayOff(data: CreateDayOffWithUserIdDto): Promise<DayOff> {
    return this.dayOff.create({...data, finishDate: new Date(data.finishDate), startDate: new Date(data.startDate)});
  }

  public async updateDayOff(id: string, data: Partial<DayOff>): Promise<DayOff> {
    return this.dayOff.findOneAndUpdate({_id: id}, data);
  }

  public async getPendingDaysOff(): Promise<DayOff[]> {
    return this.dayOff.find({status: DayOffStatus.pending});
  }

  public async getUserDaysOff(userId: string): Promise<DayOff[]> {
    const startOfCurrentYear = new Date(new Date().getFullYear(), 0, 1)
    return this.dayOff.find({
      userId, finishDate: {
        $gte: startOfCurrentYear,
      }
    });
  }

}

export default DayOffService;
