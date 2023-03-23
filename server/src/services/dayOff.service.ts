import { CreateDayOffBackendDto, CreateDayOffDto } from "@dtos/dayOff.dto";
import dayOffModel from "@models/dayOff.model";
import { DayOff, DayOffStatus, DayOffType } from "@interfaces/dayOff.interface";
import { HttpException } from "@exceptions/HttpException";
import {
  getDayOffBusinessDaysWithCalendarEvents,
  getStartOfCurrentYear,
  getWorkingDays,
  YearlyLimitsForDaysOffTypes
} from "@utils/dayOff.helpers";
import CalendarEventService from "@services/calendarEvent.service";
import { CalendarEvent } from "@interfaces/calendarEvent.interface";
import mongoose from "mongoose";

class DayOffService {
  public dayOff = dayOffModel;
  public calendarEventService = new CalendarEventService();


  public async createDayOff(data: CreateDayOffBackendDto): Promise<DayOff> {
    return this.dayOff.create({ ...data, finishDate: new Date(data.finishDate), startDate: new Date(data.startDate) });
  }

  public async updateDayOff(id: string, data: Partial<DayOff>): Promise<DayOff> {
    return this.dayOff.findOneAndUpdate({ _id: id }, data);
  }

  public async deleteDayOff(_id: string) {
    return this.dayOff.findOneAndDelete({ _id });
  }

  public async getDayOffs() {
    return this.dayOff.find().populate("userId", "_id name surname email");
  }

  public async getDayOffById(_id: string): Promise<DayOff> {
    return this.dayOff.findOne({ _id });
  }

  public async getPendingDaysOff(): Promise<DayOff[]> {
    return this.dayOff.find({ status: DayOffStatus.pending }).populate("userId", "_id name surname email").lean();
  }

  public async getUserDaysOff(userId: string): Promise<DayOff[]> {
    return this.dayOff.find({
      userId,
      finishDate: {
        $gte: getStartOfCurrentYear()
      }
    });
  }

  public async dayOffExceedsLimit(holidaysForCurrentYear: CalendarEvent[], dayOff: DayOff): Promise<boolean> {
    const userDaysOffOfType = await this.dayOff.find({
      userId: dayOff.userId,
      status: { $ne: DayOffStatus.declined },
      _id: { $ne: dayOff._id },
      startDate: {
        $gte: getStartOfCurrentYear()
      },
      type: dayOff.type
    });
    const currentLimit = YearlyLimitsForDaysOffTypes[dayOff.type]();
    const limitUsed = userDaysOffOfType.reduce((acc, val) => acc + this.getDayOffBusinessDaysWithCalendarEvents(holidaysForCurrentYear, val), 0) ?? 0;
    const limitLeft = currentLimit - limitUsed;
    const limitRequired = this.getDayOffBusinessDaysWithCalendarEvents(holidaysForCurrentYear, dayOff);
    if (limitLeft < limitRequired) {
      return true;
    }
    return false;
  }

  public async validateDayOff(userId: string, data: CreateDayOffDto): Promise<boolean> {
    const intersectingDaysOff = await this.dayOff.findOne({
      userId,
      status: { $ne: DayOffStatus.declined },
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
    });
    if (intersectingDaysOff) {
      throw new HttpException(409, "New day off intersects with previously created");
    }
    return true;
  }

  public calculateDayOffDayCount(data: CreateDayOffDto): number {
    return getWorkingDays(new Date(data.startDate), new Date(data.finishDate));
  }

  private getDayOffBusinessDaysWithCalendarEvents = (holidaysForCurrentYear: CalendarEvent[], dayOff: DayOff) => {
    return getDayOffBusinessDaysWithCalendarEvents(holidaysForCurrentYear, dayOff);
  };

  public async getUserDaysOffUsage(userId: string): Promise<Record<DayOffType, { used: number; limit: number }>> {
    const aggregatedDaysOff: Array<{ _id: DayOffType, daysOff: DayOff[] }> = await this.dayOff
      .aggregate()
      .match({
        userId: new mongoose.Types.ObjectId(userId),
        finishDate: {
          $gte: getStartOfCurrentYear()
        }
      })
      .group({
        _id: "$type",
        daysOff: { $push: "$$ROOT" }
      })
      .exec();
    const holidaysForCurrentYear = await this.calendarEventService.getHolidaysForCurrentYear();
    // console.log("holidays", holidaysForCurrentYear)
    return Object.fromEntries(
      Object.values(DayOffType).map(type => {
        const data = aggregatedDaysOff.find(({ _id }) => _id === type);

        const used = data?.daysOff.reduce((acc, dayOff) => {
          return acc + this.getDayOffBusinessDaysWithCalendarEvents(holidaysForCurrentYear, dayOff);
        }, 0) ?? 0;

        return [
          type,
          {
            used,
            limit: YearlyLimitsForDaysOffTypes[type]()
          }
        ];
      })
    ) as Record<DayOffType, { used: number; limit: number }>;
  }
}

export default DayOffService;
