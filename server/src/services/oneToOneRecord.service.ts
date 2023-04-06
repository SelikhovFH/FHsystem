import oneToOneRecordModel from "@models/oneToOneRecord.model";
import { CreateOneToOneRecordDto, UpdateOneToOneRecordDto } from "@dtos/oneToOneRecord.dto";
import dayjs, { Dayjs } from "dayjs";
import { OneToOneRecord } from "@interfaces/oneToOneRecord.interface";
import { Container, Service } from "typedi";
import { OneToOneSettings, OneToOneSettingsPeriod } from "@interfaces/settings/oneToOneSettings";
import { SettingsService } from "@services/settings.service";
import { SettingsModules } from "@interfaces/settings/settingsModules.enum";
import * as console from "console";
import UserService from "@services/user.service";
import { NotificationsDispatcher } from "@services/notifications/notifications.dispatcher";
import { getDisplayName } from "@utils/formatters";
import { NotificationType } from "@interfaces/notification.interface";
import { CronJob } from "cron";
import { CronExpression } from "@utils/cron-expression.enum";

@Service()
class OneToOneRecordService {
  private oneToOneRecord = oneToOneRecordModel;
  private oneToOneSettings: OneToOneSettings;
  private settingsService = Container.get(SettingsService);
  private userService = Container.get(UserService);
  private notificationsDispatcher = Container.get(NotificationsDispatcher);

  constructor() {
    this.settingsService.getSettings<OneToOneSettings>(SettingsModules.OneToOne).then(settings => {
      this.oneToOneSettings = settings;
    });
    const job = new CronJob(CronExpression.EVERY_DAY_AT_MIDNIGHT, this.notifyForTimeToHoldOneToOne.bind(this));
    job.start();
  }

  public async createOneToOneRecord(data: CreateOneToOneRecordDto) {
    return this.oneToOneRecord.create(data);
  }

  public async updateOneToOneRecord(_id: string, data: Partial<UpdateOneToOneRecordDto>) {
    return this.oneToOneRecord.findOneAndUpdate({ _id }, data);
  }

  public async deleteOneToOneRecord(_id: string) {
    return this.oneToOneRecord.findOneAndDelete({ _id });
  }

  private async notifyForTimeToHoldOneToOne() {
    try {
      const currentPeriod = await this.getCurrentPeriod();
      const currentDate = dayjs();
      const endOfPeriodIsInSevenDays = currentDate.add(7, "day").isSame(currentPeriod.finishDate, "day");

      if (!endOfPeriodIsInSevenDays) {
        return;
      }

      const users = await this.userService.getUsers();
      const currentPeriodOneToOnes = await this.oneToOneRecord.find({
        date: {
          $gte: currentPeriod.startDate,
          $lte: currentPeriod.finishDate
        }
      }).populate("creator", "_id name surname email").populate("user", "_id name surname email");

      const usersWithoutOneToOne = users.filter(user => {
        return !currentPeriodOneToOnes.find(oneToOne => oneToOne.user === user._id);
      });

      await this.notificationsDispatcher.dispatchMultipleNotifications({
        title: "Time to hold one-to-one",
        description: `It's time to hold one-to-one with your team members. You have 7 days left to do it.
         Users without one-to-one: ${usersWithoutOneToOne.map(user => getDisplayName(user)).join(", ")}`,
        type: NotificationType.warning,
        link: "/manage_one_to_one",
        event: "time_to_hold_one_to_one"
      }, await this.notificationsDispatcher.getEditorIds());

    } catch (error) {
      console.error(error);
    }
  }


  public async getOneToOneRecordsFullYear(year: Dayjs) {
    return this.oneToOneRecord.find({
      date: {
        $gte: year.startOf("year"),
        $lte: year.endOf("year")
      }
    }).populate("creator", "_id name surname email").populate("user", "_id name surname email");
  }

  private async getCurrentPeriod(): Promise<({ startDate: Date, finishDate: Date })> {
    const periods = this.generatePeriods();
    const currentDate = new Date();
    const currentPeriod =
      periods.find(period => currentDate >= period.startDate && currentDate <= period.finishDate);
    return currentPeriod;
  }

  public generatePeriods(): ({ startDate: Date, finishDate: Date })[] {
    const periodType = this.oneToOneSettings.period;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const periods = [];

    const periodTypes = {
      [OneToOneSettingsPeriod.Month]: {
        count: 12,
        getDates: (i) => [
          new Date(year, i, 1),
          new Date(year, i + 1, 0)
        ]
      },
      [OneToOneSettingsPeriod.twoWeeks]: {
        count: 26,
        getDates: (i) => [
          new Date(year, 0, i * 14 + 1),
          new Date(year, 0, (i + 1) * 14)
        ]
      },
      [OneToOneSettingsPeriod.twoMonths]: {
        count: 6,
        getDates: (i) => [
          new Date(year, i * 2, 1),
          new Date(year, i * 2 + 2, 0)
        ]
      },
      [OneToOneSettingsPeriod.threeMonths]: {
        count: 4,
        getDates: (i) => [
          new Date(year, i * 3, 1),
          new Date(year, i * 3 + 3, 0)
        ]
      },
      [OneToOneSettingsPeriod.sixMonths]: {
        count: 2,
        getDates: (i) => [
          new Date(year, i * 6, 1),
          new Date(year, i * 6 + 6, 0)
        ]
      }
    };

    const periodTypeConfig = periodTypes[periodType];
    if (!periodTypeConfig) {
      throw new Error(`Invalid period type: ${periodType}`);
    }

    for (let i = 0; i < periodTypeConfig.count; i++) {
      const [startDate, endDate] = periodTypeConfig.getDates(i);
      const period = {
        startDate: startDate.toISOString(),
        finishDate: endDate.toISOString()
      };
      periods.push(period);
    }

    return periods;
  }

  public groupOneToOneRecordsByUser = (records: OneToOneRecord[]) => {
    return Object.values(records.reduce((acc, cur) => {
      const user = cur.user._id;
      if (!acc[user]) {
        acc[user] = [];
      }
      acc[user].push(cur);
      return acc;
    }, {}));
  };

}

export default OneToOneRecordService;
