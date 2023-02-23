import { User } from "./user.interface";
import { Project } from "./project.interface";

export interface TimeTrack {
  _id: string;
  userId: string;
  date: Date;
  hours: number;
  projectId: string;
  isMonthTrack: boolean;
  comment: string;
}

export interface TimeTrackResponse extends TimeTrack {
  project: Project;
}

export interface WorkingDaysInfo {
  workingDays: number,
  eventsDays: number,
  totalHours: number
}

export interface CreateTrackPrefill extends WorkingDaysInfo {
  dayOffDays: number,
  totalUserHours: number,
  trackedHours: number
  comment: string
}

export interface GetTimeTracksResponse {
  timeTracks: {
    userId: string,
    user: User;
    totalHours: number;
    tracks: TimeTrackResponse[]
  }[],
  usersWithNoTracks: User[],
  workingDays: WorkingDaysInfo
}

