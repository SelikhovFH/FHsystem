import { User } from "./user.interface";

export interface MonthlyGeneral {
  workers: {
    user: User;
    income: { rate: number; project: number; hours: number; total: number }[];
    incomeTotal: number;
    unpaidDayOffs: number;
    salaryTotal: number;
    balance: number;
  }[];
  incomeTotal: number;
  expenseTotal: number;
  total: number;
}
