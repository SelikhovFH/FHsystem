import { User } from "@interfaces/user.interface";

export interface DayOff {
  _id: string;
  startDate: string;
  finishDate: string;
  dayCount: number;
  userId: string;
  approvedById: string;
  status: DayOffStatus;
  type: DayOffType;
}

export interface DayOffResponse extends DayOff {
  user: User;
}

export enum DayOffStatus {
  pending = "pending",
  approved = "approved",
  declined = "declined",
}

export enum DayOffType {
  vacation = "vacation",
  sickLeave = "sickLeave",
  unpaid = "unpaid",
  dayOff = "dayOff",
}
