import dayjs, { Dayjs } from "dayjs";

export const formatDate = (date?: string | Date | Dayjs) => {
  if (!date) {
    return null;
  }
  return dayjs(date).format("DD.MM.YYYY");
};

export const formatMoney = (value: number) => {
  return `$${value}`;
};
