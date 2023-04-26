import { Service } from 'typedi';
import { MonthlyGeneral } from '@interfaces/budget.interface';
import userModel from '@models/user.model';
import projectModel from '@models/project.model';
import dayOffModel from '@models/dayOff.model';
import dayjs from 'dayjs';
import timeTrackModel from '@/models/timeTrack.model';
import * as console from 'console';

@Service()
export class BudgetService {
  user = userModel;
  project = projectModel;
  dayOff = dayOffModel;
  timeTrack = timeTrackModel;

  public async getMonthlyGeneral(date: Date): Promise<MonthlyGeneral> {
    const currentMonth = dayjs(date);

    const [users, projects, dayOffs, timeTracks] = await Promise.all([
      this.user.find().select('+salaryHistory'),
      this.project.find(),
      this.dayOff.find({
        date: {
          $gte: currentMonth.startOf('month').toDate(),
          $lte: currentMonth.endOf('month').toDate(),
        },
      }),
      this.timeTrack.find({
        date: {
          $gte: currentMonth.startOf('month').toDate(),
          $lte: currentMonth.endOf('month').toDate(),
        },
      }),
    ]);

    const workers = users.map(user => {
      const income = projects
        .filter(project => project.workers.find(worker => worker.user.toString() === user._id.toString()))
        .map(project => {
          const rate = project.workers.find(worker => worker.user.toString() === user._id.toString())?.titles?.[0]?.rate ?? 0;
          const hours = timeTracks
            .filter(timeTrack => timeTrack.userId.toString() === user._id.toString() && timeTrack.projectId.toString() === project._id.toString())
            .reduce((acc, timeTrack) => acc + timeTrack.hours, 0);
          return {
            project: project.name,
            rate,
            hours,
            total: rate * hours,
          };
        });

      const incomeTotal = income.reduce((acc, item) => acc + item.total, 0);
      const salaryTotal = user.salaryHistory?.[0]?.value ?? 0;
      const unpaidDayOffs = dayOffs.filter(dayOff => dayOff.userId.toString() === user._id.toString()).length;
      const balance = incomeTotal - salaryTotal;

      return {
        user,
        salaryTotal,
        unpaidDayOffs,
        income,
        incomeTotal,
        balance,
      };
    });

    const incomeTotal = workers.reduce((acc, worker) => acc + worker.incomeTotal, 0);
    const expenseTotal = workers.reduce((acc, worker) => acc + worker.salaryTotal, 0);
    const total = workers.reduce((acc, worker) => acc + worker.balance, 0);

    return {
      workers,
      incomeTotal,
      expenseTotal,
      total,
    };
  }
}
