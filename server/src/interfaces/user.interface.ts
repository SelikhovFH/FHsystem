import { Device } from "@interfaces/device.interface";
import { Delivery } from "@interfaces/delivery.interface";
import { DayOff } from "@interfaces/dayOff.interface";

export interface User {
  _id: string;
  auth0id: string;
  email: string;
  role: UserRole;
  name: string;
  surname: string;
  workStartDate: string;
  phone: string;
  emergencyContact: string;
  location: string;
  title: string;
  salaryHistory: SalaryRecord[];
  cvLink: string;
  status: UserStatus;
  birthDate: string;
}

export interface SalaryRecord {
  value: number;
  date: string;
}

export interface UserProfile extends User {
  devices: Device[];
  deliveries: Delivery[];
  daysOff: DayOff[];
}

export enum UserStatus {
  working = "working",
  bench = "bench",
  training = "training",
}

export enum UserRole {
  user = "user",
  editor = "editor",
  admin = "admin",
}
