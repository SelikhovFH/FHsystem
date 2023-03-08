import oneToOneRecordModel from "@models/oneToOneRecord.model";
import { CreateOneToOneRecordDto, UpdateOneToOneRecordDto } from "@dtos/oneToOneRecord.dto";
import { Dayjs } from "dayjs";

class OneToOneRecordService {
  private oneToOneRecord = oneToOneRecordModel;

  public async createOneToOneRecord(data: CreateOneToOneRecordDto) {
    return this.oneToOneRecord.create(data);
  }

  public async updateOneToOneRecord(_id: string, data: Partial<UpdateOneToOneRecordDto>) {
    return this.oneToOneRecord.findOneAndUpdate({ _id }, data);
  }

  public async deleteOneToOneRecord(_id: string) {
    return this.oneToOneRecord.findOneAndDelete({ _id });
  }


  public async getOneToOneRecordsFullYear(year: Dayjs) {
    return this.oneToOneRecord.find({
      date: {
        $gte: year.startOf("year"),
        $lte: year.endOf("year")
      }
    }).populate("creator", "_id name surname email").populate("user", "_id name surname email");
  }

  public getAggregatedDatesForOneToOne = (dates: Date[]) => {
    const uniqueDates = dates.filter((date, i, self) =>
      self.findIndex(d => d.getTime() === date.getTime()) === i
    );
    const groups: Record<string, Date[]> = {};
    uniqueDates.forEach((date) => {
      const key = `${date.getMonth()}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(date);
    });
    return Object.values(groups).map(v => v[0]);
  };

}

export default OneToOneRecordService;
