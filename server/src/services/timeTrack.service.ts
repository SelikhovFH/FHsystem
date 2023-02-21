import timeTrackModel from "@models/timeTrack.model";
import { CreateTimeTrackDto, UpdateTimeTrackDto } from "@dtos/timeTrack.dto";
import { TimeTrack } from "@interfaces/timeTrack.interface";
import userModel from "@models/user.model";
import userService from "@services/user.service";
import dayjs from "dayjs";
import { HttpException } from "@exceptions/HttpException";
import calendarEventModel from "@models/calendarEvent.model";
import dayOffModel from "@models/dayOff.model";
import { DayOffStatus, DayOffType } from "@interfaces/dayOff.interface";

class TimeTrackService {
  private timeTrack = timeTrackModel;
  private user = userModel;
  private calendarEvent = calendarEventModel;
  private dayOff = dayOffModel;


  public async createTimeTrack(data: CreateTimeTrackDto & { userId: string }): Promise<TimeTrack> {
    return this.timeTrack.create({ ...data });
  }

  public async updateTimeTrack(_id: string, data: Partial<UpdateTimeTrackDto>): Promise<TimeTrack> {
    return this.timeTrack.findOneAndUpdate({ _id }, data);
  }

  public async deleteTimeTrack(_id: string) {
    return this.timeTrack.findOneAndDelete({ _id });
  }

  public async getUserTimeTracks(userId: string) {
    return this.timeTrack.find({ userId });
  }

  public async getTimeTrackById(_id: string) {
    return this.timeTrack.findOne({ _id });
  }


  public async getTimeTracks(date: Date) {
    const start = dayjs(date).startOf("month").toDate();
    const finish = dayjs(date).endOf("month").toDate();
    return this.timeTrack.aggregate().match({
      date: {
        $gte: start,
        $lte: finish
      }
    }).lookup({
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    })
      .unwind({
        path: "$user",
        preserveNullAndEmptyArrays: true
      })
      .project(userService.GET_PUBLIC_PROJECTION("user"))
      .group({
        _id: "userId"
      })
      .exec();
  }

  public async getCreateTrackPrefill(userId: string, date: Date) {
    const workingHours = await this.getWorkingDays(date);
    const userDaysOff = await this.getUserDaysOff(userId, date);
    const daysOffDays = Object.values(userDaysOff).reduce((acc, v) => acc + v, 0);
    return {
      ...workingHours,
      dayOffDays: daysOffDays,
      resultHours: (workingHours.workingDays - workingHours.eventsDays - daysOffDays) * 8,
      comment: `
      ${userDaysOff.dayOff && `Days off: ${userDaysOff.dayOff}`}
      ${userDaysOff.sickLeave && `Sick leaves: ${userDaysOff.sickLeave}`}
      ${userDaysOff.vacation && `Vacations: ${userDaysOff.vacation}`}
      ${userDaysOff.unpaid && `Unpaid days off: ${userDaysOff.unpaid}`}
      `
    };
  }

  private async getUserDaysOff(userId: string, date: Date): Promise<Record<DayOffType, number>> {
    const start = dayjs(date).startOf("month");
    const finish = dayjs(date).endOf("month");
    const intersectingDaysOff = await this.dayOff.find({
      userId,
      status: DayOffStatus.approved,
      $or: [
        {
          startDate: {
            $gte: start.toDate(),
            $lte: finish.toDate()
          }
        },
        {
          finishDate: {
            $gte: start.toDate(),
            $lte: finish.toDate()
          }
        }
      ]
    });

    return intersectingDaysOff.reduce((acc, dayOff) => {
      const newAcc = { ...acc };
      const limitedDayOffStart = dayjs.max(dayjs(dayOff.startDate), start);
      const limitedDayOffFinish = dayjs.min(dayjs(dayOff.finishDate), finish);
      // @ts-ignore
      const limitedBusinessDays = limitedDayOffStart.businessDiff(limitedDayOffFinish);

      newAcc[dayOff.type] += limitedBusinessDays;

      return newAcc;
    }, { [DayOffType.dayOff]: 0, [DayOffType.unpaid]: 0, [DayOffType.sickLeave]: 0, [DayOffType.vacation]: 0 });

  }

  public async getWorkingDays(date: Date) {
    const start = dayjs(date).startOf("month").toDate();
    const finish = dayjs(date).endOf("month").toDate();
    // @ts-ignore
    const workingDays = dayjs(monthForTracks).businessDaysInMonth().length;
    const holidayCalendarEventsForMonth = await this.calendarEvent.find({
      isDayOff: true, $or: [
        { date: { $gte: start, $lte: finish } },
        { isRecurring: true, "$expr": { "$eq": [{ "$month": "$date" }, dayjs(date).month()] } }
      ]
    });
    const calendarEventsOnBusinessDays = holidayCalendarEventsForMonth.filter(event => {
      if (event.isRecurring) {
        const originalDate = dayjs(event.date);
        // @ts-ignore
        return dayjs().month(originalDate.month()).date(originalDate.date()).isBusinessDay();
      }
      // @ts-ignore
      return dayjs(event.date).isBusinessDay();
    });
    return {
      workingDays: workingDays,
      eventsDays: calendarEventsOnBusinessDays.length
    };
  }

  public async validateTimeTrack(timeTrack: CreateTimeTrackDto) {
    if (new Date(timeTrack.date) > new Date()) {
      throw new HttpException(400, "Can't track time for future date");
    }
    if (new Date(timeTrack.date) < dayjs().subtract(1, "month").toDate()) {
      throw new HttpException(400, "Can't track time if more than 1 month passed");
    }
    if (timeTrack.isMonthTrack) {
      if (timeTrack.hours > 300) {
        throw  new HttpException(400, "Can't track more than 300 hours");
      }
    } else {
      if (timeTrack.hours > 16) {
        throw  new HttpException(400, "Can't track more than 16 hours");
      }
    }
    return true;
  }
}

export default TimeTrackService;
