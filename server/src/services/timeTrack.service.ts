import timeTrackModel from "@models/timeTrack.model";
import { CreateTimeTrackDto, UpdateTimeTrackDto } from "@dtos/timeTrack.dto";
import { CreateTrackPrefill, TimeTrack, WorkingDaysInfo } from "@interfaces/timeTrack.interface";
import userModel from "@models/user.model";
import userService from "@services/user.service";
import dayjs from "dayjs";
import { HttpException } from "@exceptions/HttpException";
import calendarEventModel from "@models/calendarEvent.model";
import dayOffModel from "@models/dayOff.model";
import { DayOffStatus, DayOffType } from "@interfaces/dayOff.interface";
import { CronJob } from "cron";
import { CronExpression } from "@utils/cron-expression.enum";
import { NotificationType } from "@interfaces/notification.interface";
import { NotificationsDispatcher } from "@services/notifications/notifications.dispatcher";
import Container from "typedi";

class TimeTrackService {
  private timeTrack = timeTrackModel;
  private user = userModel;
  private calendarEvent = calendarEventModel;
  private dayOff = dayOffModel;
  private notificationsDispatcher = Container.get(NotificationsDispatcher);

  constructor() {
    const job = new CronJob(CronExpression.EVERY_25TH_DAY_OF_MONTH, this.notifyAboutUntrackedTime.bind(this));
    job.start();
  }

  private async notifyAboutUntrackedTime() {
    const users = await this.user.find();
    const currentMonthTimeTracks = await this.timeTrack.find({
      date: {
        $gte: dayjs().startOf("month").toDate(),
        $lte: dayjs().endOf("month").toDate()
      }
    });
    const usersWithoutTimeTracks = users.filter(user => {
      return !currentMonthTimeTracks.find(timeTrack => timeTrack.userId === user._id);
    });

    const usersWithoutTimeTracksIds = usersWithoutTimeTracks.map(user => user._id);

    this.notificationsDispatcher.dispatchMultipleNotifications({
      title: "Untracked time",
      description: `You haven't tracked your time for this month. Please do it as soon as possible.`,
      event: "untracked_time",
      link: "/time_track",
      type: NotificationType.warning
    }, usersWithoutTimeTracksIds);

  }


  public async createTimeTrack(data: CreateTimeTrackDto & { userId: string }): Promise<TimeTrack> {
    return this.timeTrack.create({ ...data });
  }

  public async updateTimeTrack(_id: string, data: Partial<UpdateTimeTrackDto>): Promise<TimeTrack> {
    return this.timeTrack.findOneAndUpdate({ _id }, data);
  }

  public async deleteTimeTrack(_id: string) {
    return this.timeTrack.findOneAndDelete({ _id });
  }

  public async getUserTimeTracks(userId: string, date: Date) {
    const start = dayjs(date).startOf("month").toDate();
    const finish = dayjs(date).endOf("month").toDate();
    return this.timeTrack.aggregate().match({
      userId,
      date: {
        $gte: start,
        $lte: finish
      }
    }).lookup({
      from: "projects",
      localField: "projectId",
      foreignField: "_id",
      as: "project"
    })
      .unwind({
        path: "$project",
        preserveNullAndEmptyArrays: true
      })
      .exec();
  }

  public async getUserTimeTracksGroupedByProject(userId: string, date: Date) {
    const start = dayjs(date).startOf("month").toDate();
    const finish = dayjs(date).endOf("month").toDate();
    return this.timeTrack.aggregate().match({
      date: {
        $gte: start,
        $lte: finish
      }
    })
      .group({
        _id: "$projectId",
        projectId: { "$first": "$projectId" },
        totalHours: { "$sum": "$hours" },
        tracks: { $push: "$$ROOT" }
      })
      .lookup({
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "project"
      })
      .unwind({
        path: "$project",
        preserveNullAndEmptyArrays: true
      })
      .exec();
  }


  public async getTimeTrackById(_id: string) {
    return this.timeTrack.findOne({ _id });
  }


  public async getTimeTracks(date: Date) {
    const start = dayjs(date).startOf("month").toDate();
    const finish = dayjs(date).endOf("month").toDate();
    return this.timeTrack.aggregate()
      .match({
        date: {
          $gte: start,
          $lte: finish
        }
      })
      .lookup({
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "project"
      })
      .unwind({
        path: "$project",
        preserveNullAndEmptyArrays: true
      })
      .group({
        _id: "userId",
        userId: { "$first": "$userId" },
        totalHours: { "$sum": "$hours" },
        tracks: { $push: "$$ROOT" }
      })
      .lookup({
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
      .exec();
  }

  public async getCreateTrackPrefill(userId: string, date: Date): Promise<CreateTrackPrefill> {
    const workingHours = await this.getWorkingDays(date);
    const userDaysOff = await this.getUserDaysOff(userId, date);
    const start = dayjs(date).startOf("month").toDate();
    const finish = dayjs(date).endOf("month").toDate();
    const timeTracksForUserForMonth = await this.timeTrack.find({
      userId,
      date: {
        $gte: start,
        $lte: finish
      }
    });
    const trackedHours = timeTracksForUserForMonth.reduce((acc, v) => acc + v.hours, 0);
    const dayOffDays = Object.values(userDaysOff).reduce((acc, v) => acc + v, 0);
    return {
      ...workingHours,
      trackedHours,
      dayOffDays,
      totalUserHours: (workingHours.workingDays - workingHours.eventsDays - dayOffDays) * 8,
      comment: `${userDaysOff.dayOff ? `Days off: ${userDaysOff.dayOff}\n` : ""}${userDaysOff.sickLeave ? `Sick leaves: ${userDaysOff.sickLeave}\n` : ""}${userDaysOff.vacation ? `Vacations: ${userDaysOff.vacation}\n` : ""}${userDaysOff.unpaid ? `Unpaid days off: ${userDaysOff.unpaid}\n` : ""}
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
      const limitedBusinessDays = Math.abs(limitedDayOffStart.businessDiff(limitedDayOffFinish)) + 1;

      newAcc[dayOff.type] += limitedBusinessDays;

      return newAcc;
    }, { [DayOffType.dayOff]: 0, [DayOffType.unpaid]: 0, [DayOffType.sickLeave]: 0, [DayOffType.vacation]: 0 });

  }

  public async getWorkingDays(date: Date): Promise<WorkingDaysInfo> {
    const start = dayjs(date).startOf("month").toDate();
    const finish = dayjs(date).endOf("month").toDate();
    // @ts-ignore
    const workingDays = dayjs(date).businessDaysInMonth().length;
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
    const eventsDays = calendarEventsOnBusinessDays.length;
    return {
      workingDays: workingDays,
      eventsDays: eventsDays,
      totalHours: (workingDays - eventsDays) * 8
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
