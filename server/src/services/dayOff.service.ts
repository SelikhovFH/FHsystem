import {CreateDayOffBackendDto, CreateDayOffDto} from "@dtos/dayOff.dto";
import dayOffModel from "@models/dayOff.model";
import {DayOff, DayOffStatus, DayOffType} from "@interfaces/dayOff.interface";
import {HttpException} from "@exceptions/HttpException";
import {getStartOfCurrentYear, getWorkingDays, YearlyLimitsForDaysOffTypes} from "@utils/dayOff.helpers";

class DayOffService {
  public dayOff = dayOffModel;

  public async createDayOff(data: CreateDayOffBackendDto): Promise<DayOff> {
    return this.dayOff.create({...data, finishDate: new Date(data.finishDate), startDate: new Date(data.startDate)});
  }

  public async updateDayOff(id: string, data: Partial<DayOff>): Promise<DayOff> {
    return this.dayOff.findOneAndUpdate({_id: id}, data);
  }

  public async getPendingDaysOff(): Promise<DayOff[]> {
    return this.dayOff.find({status: DayOffStatus.pending});
  }

  public async getUserDaysOff(userId: string): Promise<DayOff[]> {
    return this.dayOff.find({
      userId, finishDate: {
        $gte: getStartOfCurrentYear(),
      }
    });
  }

  public async validateDayOff(userId: string, data: CreateDayOffDto): Promise<boolean> {
    const userDaysOffOfType = await this.dayOff.find({
      userId,
      status: {$ne: DayOffStatus.declined},
      startDate: {
        $gte: getStartOfCurrentYear(),
      },
      type: data.type
    })
    const currentLimit = YearlyLimitsForDaysOffTypes[data.type]()
    const limitUsed = userDaysOffOfType.reduce((acc, val) => acc + val.dayCount, 0) ?? 0
    const limitLeft = currentLimit - limitUsed
    const limitRequired = this.calculateDayOffDayCount(data)

    if (limitLeft < limitRequired) {
      throw new HttpException(409, 'Day limit exceeded')
    }
    const intersectingDaysOff = await this.dayOff.findOne({
      userId,
      status: {$ne: DayOffStatus.declined},
      $or: [
        {
          startDate: {
            $gte: new Date(data.startDate),
            $lte: new Date(data.finishDate)
          }
        },
        {
          finishDate: {
            $gte: new Date(data.startDate),
            $lte: new Date(data.finishDate)
          }
        }
      ]
    })
    if (intersectingDaysOff) {
      throw new HttpException(409, 'New day off intersects with previously created')
    }
    return true
  }

  public calculateDayOffDayCount(data: CreateDayOffDto): number {
    return getWorkingDays(new Date(data.startDate), new Date(data.finishDate))
  }

  public async getUserDaysOffUsage(userId: string): Promise<Record<DayOffType, { used: number; limit: number }>> {
    const aggregatedDaysOff = await this.dayOff.aggregate().match({userId}).group({
      _id: '$type',
      count: {$sum: '$dayCount'},
    })
    return Object.fromEntries(Object.values(DayOffType).map(type => {
      return [type, {
        used: aggregatedDaysOff.find(({_id}) => _id === type)?.count || 0,
        limit: YearlyLimitsForDaysOffTypes[type]()
      }]
    })) as Record<DayOffType, { used: number; limit: number }>
  }

}

export default DayOffService;
