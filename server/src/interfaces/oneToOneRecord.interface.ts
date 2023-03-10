import { User } from "@interfaces/user.interface";

export interface OneToOneRecord {
  _id: string;
  creator: User;
  user: User;
  date: string;
  notes: string;
  impression: Impression;
}

export type Impression = 1 | 2 | 3 | 4 | 5
