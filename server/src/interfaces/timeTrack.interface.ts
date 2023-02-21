export interface TimeTrack {
  _id: string;
  userId: string;
  date: Date;
  hours: number;
  projectId: string;
  isMonthTrack: boolean;
  comment: string;
}

