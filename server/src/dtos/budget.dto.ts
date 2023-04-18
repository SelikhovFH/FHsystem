import { IsDateString } from 'class-validator';

export class GetBudgetMonthlyGeneral {
  @IsDateString()
  date: string;
}
