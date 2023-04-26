import { User } from '@interfaces/user.interface';

export interface MonthlyGeneral {
  workers: {
    user: User;
    income: { rate: number; project: string; hours: number; total: number }[];
    incomeTotal: number;
    unpaidDayOffs: number;
    salaryTotal: number;
    balance: number;
  }[];
  incomeTotal: number;
  expenseTotal: number;
  total: number;
}
