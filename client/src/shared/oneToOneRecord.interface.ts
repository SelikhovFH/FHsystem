import { User } from "./user.interface";

export interface OneToOneRecord {
  _id: string;
  creator: User;
  user: User;
  date: string;
  notes: string;
}
