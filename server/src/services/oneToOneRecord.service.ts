import oneToOneRecordModel from "@models/oneToOneRecord.model";
import { CreateOneToOneRecordDto, UpdateOneToOneRecordDto } from "@dtos/oneToOneRecord.dto";
import { Dayjs } from "dayjs";
import { OneToOneRecord } from "@interfaces/oneToOneRecord.interface";
import { Container, Service } from "typedi";
import { OneToOneSettings, OneToOneSettingsPeriod } from "@interfaces/settings/oneToOneSettings";
import { SettingsService } from "@services/settings.service";
import { SettingsModules } from "@interfaces/settings/settingsModules.enum";
import * as console from "console";

@Service()
class OneToOneRecordService {
  private oneToOneRecord = oneToOneRecordModel;
  private oneToOneSettings: OneToOneSettings;
  private settingsService = Container.get(SettingsService);

  constructor() {
    this.settingsService.getSettings<OneToOneSettings>(SettingsModules.OneToOne).then(settings => {
      this.oneToOneSettings = settings;
    });
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

  public generatePeriods(): ([Date, Date])[] {
    console.log(this.oneToOneSettings);
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
