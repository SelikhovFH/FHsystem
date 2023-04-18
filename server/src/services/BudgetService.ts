import { Service } from 'typedi';
import { MonthlyGeneral } from '@interfaces/budget.interface';
import userModel from '@models/user.model';
import projectModel from '@models/project.model';
import dayOffModel from '@models/dayOff.model';
import dayjs from 'dayjs';
import timeTrackModel from '@/models/timeTrack.model';

@Service()
export class BudgetService {
  user = userModel;
  project = projectModel;
  dayOff = dayOffModel;
  timeTrack = timeTrackModel;

  public async getMonthlyGeneral(date: Date): Promise<MonthlyGeneral> {
    const currentMonth = dayjs(date);
    const users = await this.user.find();
    const projects = await this.project.find();
    const dayOffs = await this.dayOff.find({
      date: {
        $gte: currentMonth.startOf('month').toDate(),
        $lte: currentMonth.endOf('month').toDate(),
      },
    });
    const timeTracks = await this.timeTrack.find({
      date: {
        $gte: currentMonth.startOf('month').toDate(),
        $lte: currentMonth.endOf('month').toDate(),
      },
    });

    const workers = users.map(user => {
      const income = projects.map(project => {
        const rate = project.workers.find(worker => worker.user._id.toString() === user._id.toString()).titles[0].rate;
        const hours = timeTracks
          .filter(timeTrack => timeTrack.userId.toString() === user._id.toString() && timeTrack.projectId.toString() === project._id.toString())
          .reduce((acc, timeTrack) => acc + timeTrack.hours, 0);
        return {
          project: project._id,
          rate,
          hours,
          total: rate * hours,
        };
      });
      const incomeTotal = income.reduce((acc, item) => acc + item.total, 0);
      return {
        user,
        salaryTotal: user.salaryHistory[0].value,
        unpaidDayOffs: dayOffs.filter(dayOff => dayOff.userId.toString() === user._id.toString()).length,
        income: income,
        incomeTotal: incomeTotal,
        balance: incomeTotal - user.salaryHistory[0].value,
      };
    });
    return {
      workers,
      incomeTotal: workers.reduce((acc, worker) => acc + worker.incomeTotal, 0),
      expenseTotal: workers.reduce((acc, worker) => acc + worker.salaryTotal, 0),
      total: workers.reduce((acc, worker) => acc + worker.balance, 0),
    };
  }
}
