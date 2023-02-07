import { DayOffType } from "@interfaces/dayOff.interface";

export const getStartOfCurrentYear = () => new Date(new Date().getFullYear(), 0, 1);

//://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates
export const getDaysArray = function (s: Date, e: Date) {
  const a = [];
  const d = new Date(s);
  for (; d <= new Date(e); d.setDate(d.getDate() + 1)) {
    a.push(new Date(d));
  }
  return a;
};

export const YearlyLimitsForDaysOffTypes: Record<DayOffType, () => number> = {
  dayOff(): number {
    return 5;
  },
  sickLeave(): number {
    return 7;
  },
  unpaid(): number {
    return 365;
  },
  vacation(): number {
    const monthNumber = new Date().getMonth(); //(0-11)
    return (15 / 12) * (monthNumber + 1);
  }
};

export const getWorkingDays = (d1: Date, d2: Date) => {
  const dayList = getDaysArray(d1, d2);
  const dayListWithoutWeekends = dayList.filter(d => {
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 6 || dayOfWeek === 0; // 6 = Saturday, 0 = Sunday
    return !isWeekend;
  });
  return dayListWithoutWeekends.length;
};
