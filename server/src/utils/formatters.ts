import dayjs, { Dayjs } from "dayjs";
import { User } from "@interfaces/user.interface";

export const formatDate = (date?: string | Date | Dayjs) => {
  if (!date) {
    return null;
  }
  return dayjs(date).format("DD.MM.YYYY");
};

export const getDisplayName = (user: User) => `${user.name} ${user.surname}`;
