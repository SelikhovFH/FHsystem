export interface DayOff {
  _id: string;
  startDate: string;
  finishDate: string;
  dayCount: number
  userId: string;
  approvedById: string;
  status: DayOffStatus
  type: DayOffType
}

export enum DayOffStatus {
  pending = 'pending',
  approved = 'approved',
  declined = 'declined'
}

export enum DayOffType {
  vacation = 'vacation',
  sickLeave = 'sickLeave',
  unpaid = 'unpaid',
  dayOff = 'dayOff'
}
